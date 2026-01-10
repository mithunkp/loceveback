import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import protectedRoutes from "./routes/protected.routes";
import userRoutes from "./routes/users.routes";

const app = express();

app.use(cors());
app.use(express.json());

// mount auth routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(3000, () => {
  console.log("API running at http://localhost:3000");
});
