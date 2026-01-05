import { Router } from "express";
import { verifyFirebaseToken, AuthRequest } from "../middleware/firebaseAuth";

const router = Router();

router.get("/me", verifyFirebaseToken, (req: AuthRequest, res) => {
  res.json({
    uid: req.user?.uid,
    email: req.user?.email,
    name: req.user?.name,
  });
});

export default router;
