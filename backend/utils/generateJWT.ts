import jwt, { Secret, SignOptions } from "jsonwebtoken";

// configs
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/jwt";

// models
import UserModel from "../models/Users.model";

// Create a more flexible interface for JWT payload
interface JwtUser {
  id: string;
  name: string;
  email: string;
  roles?: string[] | any[];
}

export const generateJWT = (user: UserModel | JwtUser) => {
  // Extract role names if they exist
  const roleNames = Array.isArray(user.roles)
    ? user.roles.map((role) => (typeof role === "string" ? role : role.name))
    : ["user"];

  const payload = {
    id: user.id.toString(),
    username: user.name,
    email: user.email,
    roles: roleNames,
  };

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  };

  return jwt.sign(payload, JWT_SECRET as Secret, options);
};
