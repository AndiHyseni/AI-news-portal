import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import ReactionDbModel from "./Reaction.model";
import RefreshTokenDbModel from "./RefreshToken.model";
import RoleDbModel from "./Role.model";
import SavedNewsDbModel from "./SavedNews.model";
import UserRoleDbModel from "./UserRole.model";
import WatchedDbModel from "./Watched.model";

export default class UserDbModel extends Model {
  id!: string;
  name!: string;
  email!: string;
  password!: string;
  created_at?: Date;
  updated_at?: Date;

  roles?: RoleDbModel[];

  static tableName = "users";

  $beforeInsert() {
    this.id = uuidv4();
    this.created_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }

  static relationMappings = {
    reactions: {
      relation: Model.HasManyRelation,
      modelClass: ReactionDbModel,
      join: {
        from: "users.id",
        to: "reactions.user_id",
      },
    },
    refreshTokens: {
      relation: Model.HasManyRelation,
      modelClass: RefreshTokenDbModel,
      join: {
        from: "users.id",
        to: "refresh_tokens.user_id",
      },
    },
    savedNews: {
      relation: Model.HasManyRelation,
      modelClass: SavedNewsDbModel,
      join: {
        from: "users.id",
        to: "saved_news.user_id",
      },
    },
    watched: {
      relation: Model.HasManyRelation,
      modelClass: WatchedDbModel,
      join: {
        from: "users.id",
        to: "watched.user_id",
      },
    },
    userRoles: {
      relation: Model.HasManyRelation,
      modelClass: UserRoleDbModel,
      join: {
        from: "users.id",
        to: "user_roles.user_id",
      },
    },
    roles: {
      relation: Model.ManyToManyRelation,
      modelClass: RoleDbModel,
      join: {
        from: "users.id",
        through: {
          from: "user_roles.user_id",
          to: "user_roles.role_id",
        },
        to: "roles.id",
      },
    },
  };
}
