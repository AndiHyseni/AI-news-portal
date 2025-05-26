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
import UserRoleDbModel from "../../models/UserRole.model";
import RoleDbModel from "../../models/Role.model";

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

      // Create the new user
      const newUser = await UserDbModel.query().insert({
        email,
        name: email.split("@")[0],
        password: hashedPassword,
      });

      // Get the registered role (or create it if it doesn't exist)
      let registeredRole = await RoleDbModel.query().findOne({
        name: "registered",
      });

      if (!registeredRole) {
        // Create the registered role if it doesn't exist
        registeredRole = await RoleDbModel.query().insert({
          name: "registered",
          description: "Regular user with limited access",
        });
      }

      // Assign the registered role to the new user
      await UserRoleDbModel.query().insert({
        user_id: newUser.id,
        role_id: registeredRole.id,
      });

      const userViewModel = {
        UserId: newUser.id,
        Email: newUser.email,
        UserName: newUser.name,
        Role: "registered",
      };

      return ok({ user: userViewModel });
    } catch (error) {
      console.error("Registration error:", error);
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  login: async (data: Pick<UserDbModel, "email" | "password">) => {
    const { email, password } = data;

    try {
      // Check if user with this email exists
      let user = await UserDbModel.query().findOne({ email });

      if (!user) {
        return failure(
          { statusMessage: "This email doesn't exist!" },
          StatusCodeEnums.INVALID_CREDENTIALS
        );
      }

      /*Compares hashed password with the one from input*/
      const passwordIsValid = await comparePassword(password, user.password);

      if (!passwordIsValid)
        return failure(
          { statusMessage: "Invalid Credentials" },
          StatusCodeEnums.INVALID_CREDENTIALS
        );

      // Fetch roles separately to avoid relation mapping issues
      try {
        const roles = await UserDbModel.relatedQuery("roles").for(user.id);

        // Extract role names
        const roleNames = roles.map((role) => role.name) || ["user"];

        // Generate JWT
        const token = generateJWT({
          ...user,
          roles: roleNames,
        });

        // Construct response object with all necessary user data
        const response = {
          token,
          roles: roleNames,
          userId: user.id,
          name: user.name,
          email: user.email,
        };

        return ok(response);
      } catch (error) {
        console.error("Error fetching roles:", error);

        // Fallback to basic login without roles if relation query fails
        const token = generateJWT({
          ...user,
          roles: ["user"],
        });

        return ok({
          token,
          roles: ["user"],
          userId: user.id,
          name: user.name,
          email: user.email,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      return failure(
        { statusMessage: "An error occurred during login", error },
        StatusCodeEnums.UNEXPECTED
      );
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
      const { email, password, role } = data;
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
        name: email.split("@")[0],
        password: hashedPassword,
      });
      const userViewModel = {
        UserId: newAdmin.id,
        Email: newAdmin.email,
        UserName: newAdmin.name,
      };
      await UserRoleDbModel.query().insert({
        user_id: newAdmin.id,
        role_id: role,
      });
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
        UserName: user.name,
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
      const users = await UserDbModel.query().withGraphFetched("roles");
      const usersVM = users.map((user: any) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.roles.map((role: any) => role.name),
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
      const user = await UserDbModel.query().findById(data.id);
      if (!user) {
        return failure(
          { statusMessage: "User not found" },
          StatusCodeEnums.UNEXPECTED
        );
      }
      const updatedData: any = {
        name: data.username,
        email: data.email,
      };
      if (data.password) {
        updatedData.password = await hashPassword(data.password);
      }
      const updatedUser = await UserDbModel.query().patchAndFetchById(
        data.id,
        updatedData
      );

      const existingUserRole = await UserRoleDbModel.query()
        .where("user_id", data.id)
        .first();

      if (existingUserRole) {
        await UserRoleDbModel.query().where("user_id", data.id).patch({
          role_id: data.role,
        });
      } else {
        await UserRoleDbModel.query().insert({
          user_id: data.id,
          role_id: data.role,
        });
      }

      return ok({ user: updatedUser });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  resetPassword: async (data: any) => {
    try {
      const { email, password } = data;
      const user = await UserDbModel.query().findOne({ email });
      if (!user) {
        return failure(
          { statusMessage: "User not found" },
          StatusCodeEnums.UNEXPECTED
        );
      }
      const hashed = await hashPassword(password);
      const updatedUser = await UserDbModel.query().patchAndFetchById(user.id, {
        password: hashed,
      });
      return ok({ user: updatedUser });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
};
