create table profiles (
  id uuid primary key, -- This will be the UID
  name text,
  email text,
  updated_at timestamp with time zone default now()
);



