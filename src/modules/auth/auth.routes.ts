import { Router } from "express";
import { verifyFirebaseToken } from "../../middleware/firebaseAuth";
import { authHandler } from "./auth.controller";

const authrouter = Router();

/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Verify Firebase token and get user info
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
authrouter.get("/", verifyFirebaseToken, authHandler);

export default authrouter;
