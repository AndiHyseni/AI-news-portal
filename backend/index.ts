// Env Configuration
import * as dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env",
});
import { app } from "./app";
import { MODE, PORT } from "./config/env";

// Start the Server
app.listen(PORT, () => {
  console.log(`Server API is listening on port ${PORT} - "${MODE}"`);
});
