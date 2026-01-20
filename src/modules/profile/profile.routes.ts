import { Router } from "express";
import { verifyFirebaseToken } from "../../middleware/firebaseAuth";
import { profileHandler } from "./profile.controller";

const profileRouter = Router();

/**
 * @swagger
 * /profile:
 *   post:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uid
 *             properties:
 *               uid:
 *                 type: string
 *               nick_name:
 *                 type: string
 *               bio:
 *                 type: string
 *               level:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       500:
 *         description: Internal server error
 */
profileRouter.post("/", profileHandler);

export default profileRouter;
