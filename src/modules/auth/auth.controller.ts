import { Response } from "express";
import { AuthRequest } from "./auth.types";
import { upsertUserProfile } from "./auth.service";

export async function authHandler(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await upsertUserProfile(req.user);

    return res.json({
      message: "User processed successfully",
      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
}
