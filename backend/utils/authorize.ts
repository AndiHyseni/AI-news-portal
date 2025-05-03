import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../config/jwt";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  username: string;
  email: string;
  roles: string[];
  exp: number;
}

// Extend the Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export default function authorize(requiredRoles: string[] = []) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({
          message: "Unauthorized: No token provided",
        });
        return;
      }

      // Token format should be "Bearer [token]"
      const token = authHeader.split(" ")[1];
      if (!token) {
        res.status(401).json({
          message: "Unauthorized: Invalid token format",
        });
        return;
      }

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;

      // Attach user info to request object
      req.user = decoded;

      // Check if specific roles are required
      if (requiredRoles.length > 0) {
        // User must have at least one of the required roles
        const userRoles = decoded.roles || [];
        const hasRequiredRole = requiredRoles.some((role) =>
          userRoles.includes(role)
        );

        if (!hasRequiredRole) {
          res.status(403).json({
            message: "Forbidden: Insufficient permissions",
          });
          return;
        }
      }

      next();
    } catch (error) {
      res.status(401).json({
        message: "Unauthorized: Invalid token",
      });
    }
  };
}
