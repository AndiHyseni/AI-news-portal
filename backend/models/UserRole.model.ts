//UUID
import { v4 as uuidv4 } from "uuid";

//Objection
import { Model } from "objection";

//Models
import UserDbModel from "./Users.model";
import RoleDbModel from "./Role.model";

export default class UserRoleDbModel extends Model {
  user_id!: string;
  role_id!: string;
  created_at?: Date;
  updated_at?: Date;

  static tableName = "user_roles";

  // Relationships
  user?: UserDbModel;
  role?: RoleDbModel;

  $afterUpdate() {
    this.updated_at = new Date();
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "role_id"],

      properties: {
        id: { type: "string" },
        user_id: { type: "string", minLength: 1, maxLength: 255 },
        role_id: { type: "string", minLength: 1, maxLength: 255 },
      },
    };
  }
  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: __dirname + "/Users.model",
      join: {
        from: "user_roles.user_id",
        to: "users.id",
      },
    },
    role: {
      relation: Model.BelongsToOneRelation,
      modelClass: __dirname + "/Role.model",
      join: {
        from: "user_roles.role_id",
        to: "roles_v2.id",
      },
    },
  };
}
