import request from "supertest";
import express from "express";
import authRoutes from "./auth.routes"; // Ensure this path is correct

// 1. Create a standalone mock function we can control
const mockVerifyIdToken = jest.fn();

// 2. Mock firebase-admin using that function
jest.mock("firebase-admin", () => {
    return {
        credential: {
            cert: jest.fn(),
        },
        initializeApp: jest.fn(),
        // When app calls admin.auth().verifyIdToken(), it hits our mock
        auth: () => ({
            verifyIdToken: mockVerifyIdToken,
        }),
    };
});

// Import admin (not strictly necessary for the test logic now, but good for consistency)
import admin from "firebase-admin";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("Auth Routes", () => {
    // 3. Clear mocks before every test to ensure isolation
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return 401 if no token is provided", async () => {
        const res = await request(app).get("/auth/");
        
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Unauthorized" });
        // Verify Firebase was NEVER called
        expect(mockVerifyIdToken).not.toHaveBeenCalled();
    });

    it("should return 401 if invalid header format", async () => {
        const res = await request(app)
            .get("/auth/")
            .set("Authorization", "InvalidFormat"); // No "Bearer " prefix
            
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Unauthorized" });
        expect(mockVerifyIdToken).not.toHaveBeenCalled();
    });

    it("should return 200 and user info if token is valid", async () => {
        const mockUser = {
            uid: "kXapVHqdjygoc0rFkowah1B3Njh2",
            email: "mthnkp@gmail.com",
            name: "Mithun",
        };

        // 4. Control the mock directly
        mockVerifyIdToken.mockResolvedValue(mockUser);

        const res = await request(app)
            .get("/auth/")
            .set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImM0MTZJUSJ9.eyJpc3MiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGUuY29tLyIsImF1ZCI6ImxvY2V2ZS1hYmVhZCIsImlhdCI6MTc2NzgxNDI5NCwiZXhwIjoxNzY5MDIzODk0LCJ1c2VyX2lkIjoia1hhcFZIcWRqeWdvYzByRmtvd2FoMUIzTmpoMiIsImVtYWlsIjoibXRobmtwQGdtYWlsLmNvbSIsInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCIsInZlcmlmaWVkIjpmYWxzZX0.jEqZHSC5s7KMIq5ghwFcTdgRrC9laSu8oh2W8adyIpv9TajenYhFeHBSbbTbYC7_m37bSjyEFOEs8GFWWCo9P-9hWMIFgncoEFAxXYGZv9VP1Ot9RgxXti2sD_9OcjweUbfneZtSIFuf0yetPVRtAnqvBL-D5WX54DrmNrnjPxOz_mNSp-104vOrZLmRItqizn2bXx4aADBlZMTLT8Mqr2qD3bcPPvIiLnSlQfg-wbFkUgQRAmPqoB-XCp6_lOq7QChMht8RI974RUBza0gfy1EwlhsDSngcvgRN2jLDEXjIpyKBMZRLFcDUFBvDKxsknnIw0zve1DNp42C8lymfNQ"); // We don't need a real long token

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockUser);
        expect(mockVerifyIdToken).toHaveBeenCalledWith("eyJhbGciOiJSUzI1NiIsImtpZCI6ImM0MTZJUSJ9.eyJpc3MiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGUuY29tLyIsImF1ZCI6ImxvY2V2ZS1hYmVhZCIsImlhdCI6MTc2NzgxNDI5NCwiZXhwIjoxNzY5MDIzODk0LCJ1c2VyX2lkIjoia1hhcFZIcWRqeWdvYzByRmtvd2FoMUIzTmpoMiIsImVtYWlsIjoibXRobmtwQGdtYWlsLmNvbSIsInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCIsInZlcmlmaWVkIjpmYWxzZX0.jEqZHSC5s7KMIq5ghwFcTdgRrC9laSu8oh2W8adyIpv9TajenYhFeHBSbbTbYC7_m37bSjyEFOEs8GFWWCo9P-9hWMIFgncoEFAxXYGZv9VP1Ot9RgxXti2sD_9OcjweUbfneZtSIFuf0yetPVRtAnqvBL-D5WX54DrmNrnjPxOz_mNSp-104vOrZLmRItqizn2bXx4aADBlZMTLT8Mqr2qD3bcPPvIiLnSlQfg-wbFkUgQRAmPqoB-XCp6_lOq7QChMht8RI974RUBza0gfy1EwlhsDSngcvgRN2jLDEXjIpyKBMZRLFcDUFBvDKxsknnIw0zve1DNp42C8lymfNQ");
    });

    it("should return 401 if token is invalid/rejected by Firebase", async () => {
        // 5. Simulate Firebase throwing an error
        mockVerifyIdToken.mockRejectedValue(new Error("Invalid token"));

        const res = await request(app)
            .get("/auth/")
            .set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImM0MTZJUSJ9.eyJpc3MiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGUuY29tLyIsImF1ZCI6ImxvY2V2ZS1hYmVhZCIsImlhdCI6MTc2NzgxMjgxNywiZXhwIjoxNzY5MDIyNDE3LCJ1c2VyX2lkIjoia1hhcFZIcWRqeWdvYzByRmtvd2FoMUIzTmpoMiIsImVtYWlsIjoibXRobmtwQGdtYWlsLmNvbSIsInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCIsInZlcmlmaWVkIjpmYWxzZX0.WoJ0tkT_HruWwxijZ_-o12IwnKEavP19C-v9w521EpK91h71AtNF6EghrUqa-mqBXFCXCtyM3UwnbPTqnOKkdV02V9wGZDc05g-8SKOu15I3hibWtMWV2HFWfWZKA-yScKCSmNODHVbethaC_CjFE81V1cBi8ze_nOZLHztR5dd2ujRnQYx4IdvJfhqThpEfUtu6tS7-xpgv8TpG2mofpKftom-Rt7ExMgCglkwTImGCeggzUlLBKIqsC3iIjGR4PBe3-hjKRDs3vZhMne3QklWyi7GvVkFjtrORB4MIi2vPjbzS40nYTuWEoub6-zR591X06oS9Zl91xsfLJEp0MQ");

        expect(res.status).toBe(401);
        // Ensure your controller actually returns this specific message when firebase fails
        expect(res.body).toEqual({ error: "Invalid or expired token" });
    });
});