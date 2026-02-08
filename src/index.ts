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

  const debugInfo: any = {
    cwd: process.cwd(),
    __dirname: __dirname,
    NODE_ENV: process.env.NODE_ENV,
    srcAuthFiles: [],
    fileContents: {}
  };

  try {
    const srcAuthPath = path.join(process.cwd(), 'src', 'modules', 'auth');
    if (fs.existsSync(srcAuthPath)) {
      debugInfo.srcAuthFiles = fs.readdirSync(srcAuthPath);

      // Try to read content from src JS if exists
      const srcJsPath = path.join(srcAuthPath, 'auth.routes.js');
      if (fs.existsSync(srcJsPath)) {
        debugInfo.fileContents['src_auth_routes_js_preview'] = fs.readFileSync(srcJsPath, 'utf-8').substring(0, 500);
      }
    }
  } catch (e: any) { debugInfo.errorSrc = e.message; }

  try {
    const distAuthPath = path.join(process.cwd(), 'dist', 'modules', 'auth', 'auth.routes.js');
    if (fs.existsSync(distAuthPath)) {
      debugInfo.fileContents['dist_auth_routes_js_preview'] = fs.readFileSync(distAuthPath, 'utf-8').substring(0, 500);
    }
  } catch (e: any) { debugInfo.errorDist = e.message; }

  res.json(debugInfo);
});

app.listen(3000, () => {
  console.log("API running at http://localhost:3000");
});
