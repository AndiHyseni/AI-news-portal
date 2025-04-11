import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import NewsDbModel from "./News.model";
import UserDbModel from "./Users.model";

export default class WatchedDbModel extends Model {
  id!: string;
  user_id!: string;
  fingerprint_id!: string;
  news_id!: string;
  watched_on!: Date;

  news!: NewsDbModel;
  user!: UserDbModel;

  static tableName = "watched";

  $beforeInsert() {
    this.id = uuidv4();
  }

  static relationMappings = {
    news: {
      relation: Model.BelongsToOneRelation,
      modelClass: NewsDbModel,
      join: {
        from: "watched.news_id",
        to: "news.id",
      },
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserDbModel,
      join: {
        from: "watched.user_id",
        to: "users.id",
      },
    },
  };
}
