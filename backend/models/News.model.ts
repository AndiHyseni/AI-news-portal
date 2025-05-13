import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import CategoryDbModel from "./Category.model";

export default class NewsDbModel extends Model {
  id!: string;
  title!: string;
  category_id!: string;
  subtitle?: string;
  is_featured!: boolean;
  is_deleted!: boolean;
  number_of_clicks!: number;
  content!: string;
  image?: string;
  video?: string;
  expire_date?: Date;
  updated_by?: string;
  created_at?: Date;
  updated_at?: Date;
  created_by?: string;
  tags?: string;
  views?: number;

  category?: CategoryDbModel;

  static tableName = "news";

  $beforeInsert() {
    this.id = uuidv4();
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "category_id", "is_featured", "content"],

      properties: {
        id: { type: "string", minLength: 1, maxLength: 36 },
        title: { type: "string", minLength: 1 },
        category_id: { type: "string", minLength: 1 },
        subtitle: { type: "string", minLength: 1 },
        is_featured: { type: "boolean" },
        content: { type: "string", minLength: 1 },
        image: { type: "string" },
      },
    };
  }

  static relationMappings = {
    category: {
      relation: Model.HasOneRelation,
      modelClass: CategoryDbModel,
      join: {
        from: "news.category_id",
        to: "category.id",
      },
    },
  };
}
