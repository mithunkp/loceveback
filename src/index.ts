import "dotenv/config";
import express from "express";
import cors from "cors";
import { setupSwagger } from "./swagger";

import authRoutes from "./modules/auth/auth.routes";
import protectedRoutes from "./modules/protected.routes";
import userRoutes from "./modules/user/users.routes";
import profileRouter from "./modules/profile/profile.routes";


const app = express();

app.use(cors());
app.use(express.json());

setupSwagger(app);

// mount auth routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRouter);

app.listen(3000, () => {
  console.log("API running at http://localhost:3000");
});
