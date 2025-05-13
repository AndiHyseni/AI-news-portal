import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";

export default class CategoryDbModel extends Model {
  id!: string;
  name!: any;
  description?: string;
  show_online!: boolean;
  created_at?: Date;

  static tableName = "category";

  $beforeInsert() {
    this.id = uuidv4();
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "show_online"],
    };
  }
}
