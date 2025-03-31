import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt";

const authorize = () => [
  (req: Request, res: Response, next: NextFunction) => {
    let token: any =
      req.headers["x-access-token"] || req.headers["authorization"];

    if (token && token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    if (!token)
      return res
        .status(403)
        .send({ auth: false, message: "No token provided." });

    jwt.verify(token, JWT_SECRET, function (err: any, decoded: any) {
      if (err)
        return res.status(401).send({
          auth: false,
          message: "Failed to authenticate token.",
          err: err,
        });

      next();
    });
  },
];

export default authorize;
