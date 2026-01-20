import { supabase } from "../../config/supabase";
import { FirebaseUser } from "./auth.types";

export async function upsertUserProfile(user: FirebaseUser) {
  if (!user.uid) {
    throw new Error("User UID is missing");
  }

  const { data, error } = await supabase
    .from("users")
    .upsert({
      id: user.uid,
      email: user.email,
      // name is not in the users table, it belongs in profile_details
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
