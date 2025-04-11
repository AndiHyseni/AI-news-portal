import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import NewsDbModel from "./News.model";
import UserDbModel from "./Users.model";

export default class ReactionDbModel extends Model {
  id!: string;
  user_id!: string;
  news_id!: string;
  reaction!: number;

  news!: NewsDbModel;
  user!: UserDbModel;

  static tableName = "reactions";

  $beforeInsert() {
    this.id = uuidv4();
  }

  static relationMappings = {
    news: {
      relation: Model.BelongsToOneRelation,
      modelClass: NewsDbModel,
      join: {
        from: "reactions.news_id",
        to: "news.id",
      },
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserDbModel,
      join: {
        from: "reactions.user_id",
        to: "users.id",
      },
    },
  };
}
