import { Response } from "express";
import { ProfileRequest } from "./profile.types";
import { upsertProfileData } from "./profile.service";

export async function profileHandler(
    req: ProfileRequest,
    res: Response
) {
    try {
        const profileDetails = await upsertProfileData(
            req.body
        );

        return res.json({
            message: "Profile updated successfully",
            profileDetails,
        });
    } catch (error) {
        console.error("Profile Update Error:", error);
        return res.status(500).json({
            error: "Internal server error",
            details: error instanceof Error ? error.message : JSON.stringify(error)
        });
    }
}
