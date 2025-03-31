// Env Configuration
import * as dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env",
});

export const JWT_ALGORITHM = process.env.JWT_ALGORITHM || "HS256";
export const JWT_SECRET = process.env.JWT_SECRET || "M0jUcTURY7";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
