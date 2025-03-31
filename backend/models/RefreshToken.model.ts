import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import UserDbModel from "./Users.model";

export default class RefreshTokenDbModel extends Model {
  id!: string;
  jwt_id!: string;
  token!: string;
  is_revoked!: boolean;
  date_added!: Date;
  date_expires!: Date;
  user_id!: string;

  static tableName = "refresh_token";

  $beforeInsert() {
    this.id = uuidv4();
  }

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserDbModel,
      join: {
        from: "refresh_tokens.user_id",
        to: "users.id",
      },
    },
  };
}
