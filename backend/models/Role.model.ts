//UUID
import { v4 as uuidv4 } from "uuid";

//Objection
import { Model } from "objection";
import UserRoleDbModel from "./UserRole.model";

export default class RoleDbModel extends Model {
  id!: string;
  name!: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;

  user_roles?: UserRoleDbModel[];

  static tableName = "roles";

  $beforeInsert() {
    this.id = uuidv4();
  }

  $afterUpdate() {
    this.updated_at = new Date();
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],

      properties: {
        id: { type: "string" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        decription: { type: "string" },
      },
    };
  }
  static relationMappings = {
    user_roles: {
      relation: Model.HasManyRelation,
      modelClass: __dirname + "/UserRole.model",
      join: {
        from: "roles.id",
        to: "users_roles.users.id",
      },
    },
  };
}
