import { NextFunction, Request, Response } from "express";

export const CorsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    // Sent from browser before using POST or PUT
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    res.status(200).json({});
    return;
  }
  next();
};
