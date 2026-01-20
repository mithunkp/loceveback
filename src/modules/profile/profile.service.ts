import { supabase } from "../../config/supabase";
import { UpdateProfileBody } from "./profile.types";

export async function upsertProfileData(
  profileDetails: UpdateProfileBody
) {
 const { data, error } = await supabase
  .from("profile_details")
  .upsert(
    {
      // We do NOT include 'id' here so that Postgres handles the Primary Key
      profile_id: profileDetails.uid, // This is your Foreign Key
      bio: profileDetails.bio ?? null,
      nick_name: profileDetails.nick_name ?? null,
      level: profileDetails.level ?? 1,
      last_seen: profileDetails.last_seen ?? new Date().toISOString(),
    },
    { 
      onConflict: 'profile_id' // This tells Supabase to check the FKey for duplicates
    }
  )
  .select()
  .single();



  if (error) {
    throw error;
  }

  return data;
}
