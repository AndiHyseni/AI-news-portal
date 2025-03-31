import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import NewsDbModel from "./News.model";
import UserDbModel from "./Users.model";

export default class SavedNewsDbModel extends Model {
  id!: string;
  news_id!: string;
  user_id!: string;

  static tableName = "saved_news";

  $beforeInsert() {
    this.id = uuidv4();
  }

  static relationMappings = {
    news: {
      relation: Model.BelongsToOneRelation,
      modelClass: NewsDbModel,
      join: {
        from: "saved_news.news_id",
        to: "news.id",
      },
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserDbModel,
      join: {
        from: "saved_news.user_id",
        to: "users.id",
      },
    },
  };
}
