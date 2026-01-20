-- 1. Create a public 'users' table to sync Firebase Users
-- This replaces the reliance on Supabase's internal auth.users
create table public.users (
  id text not null primary key, -- Firebase UID
  email text,
  created_at timestamptz default now()
);

-- Enable RLS on users
alter table public.users enable row level security;
create policy "Public users are viewable by everyone." on public.users for select using (true);


-- 2. Create the 'profile_details' table with Foreign Key to users
create table public.profile_details (
  id uuid default gen_random_uuid() primary key, -- Internal Postgres ID
  profile_id text not null references public.users(id) on delete cascade unique, -- Link to Firebase UID
  
  nick_name text,
  bio text,
  level int default 1,
  last_seen timestamptz,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on profile_details
alter table public.profile_details enable row level security;

-- Policies
create policy "Profiles are viewable by everyone." 
  on public.profile_details for select using (true);

-- Since you are using Service Role Key in backend, you bypass RLS for inserts/updates.
-- But for safety, we can allow authenticated users if you ever use client-side calls.
create policy "Users can update their own profile."
  on public.profile_details for update
  using ( profile_id = auth.uid()::text ); -- Note: This requires syncing auth.uid() which is complex with Firebase. 
  -- Ideally, keep RLS enabled but rely on Service Role Key for writes.
