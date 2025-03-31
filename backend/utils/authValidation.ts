import { JWTModel } from "../interfaces/models/JWTModel";
import { decode } from "jsonwebtoken";

export const getUserFields = (token: string): JWTModel | null => {
  const decoded = decode(token.split(" ")[1]) as JWTModel;

  return decoded || null;
};

export const getPermissions = async (
  token: string
): Promise<{
  user_id?: string;
}> => {
  token = token.substring(7, token.length);

  const decoded = decode(token) as JWTModel;
  try {
    return {
      user_id: decoded.id || "",
    };
  } catch (error) {
    return { user_id: decoded.id };
  }
};
