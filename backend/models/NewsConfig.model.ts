import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";

export default class NewsConfigDbModel extends Model {
  id!: string;
  header_logo?: string;
  footer_logo?: string;
  show_featured!: boolean;
  show_most_watched!: boolean;
  show_related_news!: boolean;

  static tableName = "news_config";

  $beforeInsert() {
    this.id = uuidv4();
  }
}
