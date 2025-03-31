// Env Configuration
import * as dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env",
});

export const MODE = process.env.MODE || "local";

export const PORT = process.env.PORT || 5000;
export const MEMORY_LIMIT = process.env.MEMORY_LIMIT || 1000;
export const APP_URL = process.env.APP_URL || "";

export const DB_HOSTNAME = process.env.DB_HOSTNAME || "";
export const DB_PORT = process.env.DB_PORT || 3306;
export const DB_USERNAME = process.env.DB_USERNAME || "root";
export const DB_NAME = process.env.DB_NAME || "news-portal";
export const DB_PASSWORD = process.env.DB_PASSWORD || "1234";
