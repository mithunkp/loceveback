import { Request } from "express";

export interface FirebaseUser {
  uid: string;
  email?: string;
  name?: string;
}

export interface AuthRequest extends Request {
  user?: FirebaseUser;
}
