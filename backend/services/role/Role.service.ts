import { StatusCodeEnums } from "../../interfaces/enums";
import { failure, ok } from "../../utils";
import RoleDbModel from "../../models/Role.model";
import UserRoleDbModel from "../../models/UserRole.model";
import UserDbModel from "../../models/Users.model";

export const RoleService = {
  getAllRoles: async () => {
    try {
      const roles = await RoleDbModel.query();
      return ok({ roles });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },

  getRoleById: async (id: string) => {
    try {
      const role = await RoleDbModel.query().findById(id);
      if (!role) {
        return failure({ error: "Role not found" }, StatusCodeEnums.UNEXPECTED);
      }
      return ok({ role });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },

  createRole: async (roleData: { name: string; description?: string }) => {
    try {
      const role = await RoleDbModel.query().insert(roleData);
      return ok({ role });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },

  updateRole: async (
    id: string,
    roleData: { name?: string; description?: string }
  ) => {
    try {
      const role = await RoleDbModel.query().patchAndFetchById(id, roleData);
      if (!role) {
        return failure({ error: "Role not found" }, StatusCodeEnums.UNEXPECTED);
      }
      return ok({ role });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },

  deleteRole: async (id: string) => {
    try {
      // First delete all user_role associations
      await UserRoleDbModel.query().delete().where("role_id", id);

      // Then delete the role
      const deletedCount = await RoleDbModel.query().deleteById(id);
      if (deletedCount === 0) {
        return failure({ error: "Role not found" }, StatusCodeEnums.UNEXPECTED);
      }
      return ok({ message: "Role deleted successfully" });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },

  assignRoleToUser: async (userId: string, roleId: string) => {
    try {
      // Check if user exists
      const user = await UserDbModel.query().findById(userId);
      if (!user) {
        return failure({ error: "User not found" }, StatusCodeEnums.UNEXPECTED);
      }

      // Check if role exists
      const role = await RoleDbModel.query().findById(roleId);
      if (!role) {
        return failure({ error: "Role not found" }, StatusCodeEnums.UNEXPECTED);
      }

      // Check if user already has this role
      const existingUserRole = await UserRoleDbModel.query()
        .where({ user_id: userId, role_id: roleId })
        .first();

      if (existingUserRole) {
        return ok({ message: "User already has this role" });
      }

      // Assign role to user
      await UserRoleDbModel.query().insert({
        user_id: userId,
        role_id: roleId,
      });

      return ok({ message: "Role assigned to user successfully" });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },

  removeRoleFromUser: async (userId: string, roleId: string) => {
    try {
      const deletedCount = await UserRoleDbModel.query()
        .delete()
        .where({ user_id: userId, role_id: roleId });

      if (deletedCount === 0) {
        return failure(
          { error: "User does not have this role" },
          StatusCodeEnums.UNEXPECTED
        );
      }

      return ok({ message: "Role removed from user successfully" });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },

  getUserRoles: async (userId: string) => {
    try {
      const user = await UserDbModel.query()
        .findById(userId)
        .withGraphFetched("roles");

      if (!user) {
        return failure({ error: "User not found" }, StatusCodeEnums.UNEXPECTED);
      }

      return ok({ roles: user.roles });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
};
