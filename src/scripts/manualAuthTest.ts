import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import admin from "../firebase";

async function verifyToken() {
    const token = process.argv[2];

    if (!token) {
        console.error("Please provide an ID token as an argument.");
        console.log("Usage: npx ts-node src/scripts/manualAuthTest.ts <ID_TOKEN>");
        process.exit(1);
    }

    console.log("Verifying token...");

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log("✅ Token is valid!");
        console.log("User Context:", {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name || decodedToken.displayName, // Firebase sometimes uses displayName
            picture: decodedToken.picture
        });
    } catch (error) {
        console.error("❌ Token verification failed:", error);
    }
}

verifyToken();
