import { Model } from "objection";

export default class CategoryDbModel extends Model {
  id!: string;
  name!: any;
  description?: string;
  show_online!: boolean;
  created_at?: Date;

  static tableName = "category";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "show_online"],
    };
  }
}
