import jwt, { Secret, SignOptions } from "jsonwebtoken";

// configs
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/jwt";

// models
import UserModel from "../models/Users.model";

export const generateJWT = (user: UserModel) => {
  const payload = {
    id: user.id.toString(),
  };

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  };

  return jwt.sign(payload, JWT_SECRET as Secret, options);
};
