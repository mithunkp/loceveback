// profile.types.ts
import { Request } from "express";

export interface UpdateProfileBody {
  nick_name?: string;
  bio?: string;
  level?: number;
  last_seen?: string;
  uid?: string;
}

export interface ProfileRequest extends Request {
  body: UpdateProfileBody;
}
