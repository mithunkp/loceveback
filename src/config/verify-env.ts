import "dotenv/config";

console.log("Checking Environment Variables...");

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId) console.error("❌ FIREBASE_PROJECT_ID is missing");
else console.log("✅ FIREBASE_PROJECT_ID is present");

if (!clientEmail) console.error("❌ FIREBASE_CLIENT_EMAIL is missing");
else console.log("✅ FIREBASE_CLIENT_EMAIL is present");

if (!privateKey) {
    console.error("❌ FIREBASE_PRIVATE_KEY is missing");
} else {
    console.log("✅ FIREBASE_PRIVATE_KEY is present");
    if (privateKey.includes("\\n")) {
        console.log("⚠️ Private key contains literal '\\n'. It will be fixed by the app code, but ensure it's copied correctly.");
    }
    if (privateKey.startsWith("-----BEGIN PRIVATE KEY-----")) {
        console.log("✅ Private key format looks correct");
    } else {
        console.error("❌ Private key does not start with '-----BEGIN PRIVATE KEY-----'");
    }
}

console.log("Done.");
