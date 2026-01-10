import { Router } from "express";
import { verifyFirebaseToken, AuthRequest } from "../middleware/firebaseAuth";
import { supabase } from "../supabase";
const router = Router();

router.get("/", verifyFirebaseToken, async (req: AuthRequest, res) => {
  

  const { data, error } = await supabase
  .from('profiles')
  .upsert({
    id: req.user?.uid,
    email: req.user?.email,
    name: req.user?.name,
  })
  .select()
  .single();

if (error) {
  return res.status(500).json({ error: error.message });
}

return res.json({ message: "User processed successfully", user: data });
   
});

export default router;
