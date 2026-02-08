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


app.get("/debug-paths", (req, res) => {
  const fs = require('fs');
  const path = require('path');

  const debugInfo = {
    cwd: process.cwd(),
    __dirname: __dirname,
    NODE_ENV: process.env.NODE_ENV,
    distExists: fs.existsSync(path.join(process.cwd(), 'dist')),
    modulesInDist: [],
    srcExists: fs.existsSync(path.join(process.cwd(), 'src')),
    modulesInSrc: []
  };

  try {
    if (debugInfo.distExists) {
      // recursive search or just check first level
      const modulesPath = path.join(process.cwd(), 'dist', 'modules');
      if (fs.existsSync(modulesPath)) {
        debugInfo.modulesInDist = fs.readdirSync(modulesPath, { recursive: true });
      }
    }
  } catch (e: any) { debugInfo.modulesInDist = e.message }

  try {
    if (debugInfo.srcExists) {
      const modulesPath = path.join(process.cwd(), 'src', 'modules');
      if (fs.existsSync(modulesPath)) {
        debugInfo.modulesInSrc = fs.readdirSync(modulesPath, { recursive: true });
      }
    }
  } catch (e: any) { debugInfo.modulesInSrc = e.message }

  res.json(debugInfo);
});

app.listen(3000, () => {
  console.log("API running at http://localhost:3000");
});
