import { StatusCodeEnums } from "../../interfaces/enums";
import {
  ok,
  failure,
  generateJWT,
  hashPassword,
  comparePassword,
} from "../../utils";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import MailService from "../mail/MailService";
import RefreshTokenDbModel from "../../models/RefreshToken.model";
import UserDbModel from "../../models/Users.model";

export const AccountService = {
  register: async (data: any) => {
    try {
      const { email, password } = data;
      // Check for duplicate email
      const existingUser = await UserDbModel.query().findOne({ email });
      if (existingUser) {
        return failure(
          { statusMessage: "Email is taken" },
          StatusCodeEnums.UNPROCESSABLE_ENTITY
        );
      }
      // Hash password
      const hashedPassword = await hashPassword(password);
      const newUser = await UserDbModel.query().insert({
        email,
        username: email.split("@")[0],
        password_hash: hashedPassword,
      });
      const userViewModel = {
        UserId: newUser.id,
        Email: newUser.email,
        UserName: newUser.username,
      };
      return ok({ user: userViewModel });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  login: async (data: any) => {
    try {
      const { email, password, fingerPrintId } = data;
      const user = await UserDbModel.query().findOne({ email });
      if (!user) {
        return failure(
          { statusMessage: "This email doesn't exist!" },
          StatusCodeEnums.INVALID_CREDENTIALS
        );
      }
      const passwordIsValid = await comparePassword(
        password,
        user.password_hash
      );
      if (!passwordIsValid) {
        return failure(
          { statusMessage: "Invalid Credentials" },
          StatusCodeEnums.INVALID_CREDENTIALS
        );
      }
      // Generate JWT token
      const token = generateJWT(user);
      // Generate a refresh token
      const refreshToken = uuidv4();
      await RefreshTokenDbModel.query().insert({
        token: refreshToken,
        user_id: user.id,
        jwt_id: uuidv4(),
        date_added: new Date(),
        date_expires: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months expiry
      });
      // Optionally update fingerprint here if needed
      return ok({ token, refreshToken });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  refreshToken: async (tokenRequest: any) => {
    try {
      const { token, refreshToken } = tokenRequest;
      let decoded: any;
      try {
        decoded = jwt.decode(token);
      } catch (err) {
        return failure(
          { statusMessage: "Invalid token" },
          StatusCodeEnums.UNPROCESSABLE_ENTITY
        );
      }
      const storedToken = await RefreshTokenDbModel.query().findOne({
        token: refreshToken,
      });
      if (!storedToken) {
        return failure(
          { statusMessage: "Invalid refresh token" },
          StatusCodeEnums.UNPROCESSABLE_ENTITY
        );
      }
      if (new Date(storedToken.date_expires) < new Date()) {
        await RefreshTokenDbModel.query().deleteById(storedToken.id);
        return failure(
          { statusMessage: "Refresh token expired" },
          StatusCodeEnums.UNPROCESSABLE_ENTITY
        );
      }
      const user = await UserDbModel.query().findById(storedToken.user_id);
      const newToken = generateJWT(user!);
      return ok({ token: newToken, refreshToken });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  addAdmin: async (data: any) => {
    try {
      const { email, password } = data;
      const existingUser = await UserDbModel.query().findOne({ email });
      if (existingUser) {
        return failure(
          { statusMessage: "Email is taken" },
          StatusCodeEnums.UNPROCESSABLE_ENTITY
        );
      }
      const hashedPassword = await hashPassword(password);
      const newAdmin = await UserDbModel.query().insert({
        email,
        username: email.split("@")[0],
        password_hash: hashedPassword,
      });
      const userViewModel = {
        UserId: newAdmin.id,
        Email: newAdmin.email,
        UserName: newAdmin.username,
      };
      return ok({ user: userViewModel });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  getCurrentUser: async (userId: string) => {
    try {
      const user = await UserDbModel.query().findById(userId);
      if (!user) {
        return failure(
          { statusMessage: "User not found" },
          StatusCodeEnums.UNEXPECTED
        );
      }
      const userViewModel = {
        UserId: user.id,
        Email: user.email,
        UserName: user.username,
      };
      return ok({ user: userViewModel });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  logout: async (token: string) => {
    try {
      // Optionally implement refresh token deletion or token blacklisting.
      return ok({ message: "Logged out successfully" });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  getUsers: async () => {
    try {
      const users = await UserDbModel.query();
      const usersVM = users.map((user: any) => ({
        UserId: user.id,
        Email: user.email,
        UserName: user.username,
      }));
      return ok({ users: usersVM });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  deleteUser: async (userId: string) => {
    try {
      const user = await UserDbModel.query().findById(userId);
      if (!user) {
        return failure(
          { statusMessage: "User not found" },
          StatusCodeEnums.UNEXPECTED
        );
      }
      await UserDbModel.query().deleteById(userId);
      return ok({ message: "User deleted successfully" });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  forgotPassword: async (email: string) => {
    try {
      const user = await UserDbModel.query().findOne({ email });
      if (!user) {
        return failure(
          { statusMessage: "User not found" },
          StatusCodeEnums.UNEXPECTED
        );
      }
      const resetToken = uuidv4();
      const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${encodeURIComponent(
        email
      )}`;
      await MailService.sendResetPasswordEmail(email, resetLink);
      return ok({ message: "Password reset email sent" });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  editUser: async (data: any) => {
    try {
      const user = await UserDbModel.query().findById(data.userId);
      if (!user) {
        return failure(
          { statusMessage: "User not found" },
          StatusCodeEnums.UNEXPECTED
        );
      }
      const updatedData: any = {
        username: data.userName,
        email: data.email,
      };
      if (data.password) {
        updatedData.password = await hashPassword(data.password);
      }
      const updatedUser = await UserDbModel.query().patchAndFetchById(
        data.userId,
        updatedData
      );
      return ok({ user: updatedUser });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  resetPassword: async (data: any) => {
    try {
      const { email, token, password } = data;
      const user = await UserDbModel.query().findOne({ email });
      if (!user) {
        return failure(
          { statusMessage: "User not found" },
          StatusCodeEnums.UNEXPECTED
        );
      }
      const hashed = await hashPassword(password);
      const updatedUser = await UserDbModel.query().patchAndFetchById(user.id, {
        password_hash: hashed,
      });
      return ok({ user: updatedUser });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
};
