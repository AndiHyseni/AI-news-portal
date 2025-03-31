import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("news").del();

  // Inserts seed entries
  await knex("news").insert([
    {
      id: uuidv4(),
      title: "AI Breakthroughs",
      category_id: (
        await knex("category").where("name", "Technology").select("id").first()
      ).id,
      is_featured: true,
      is_deleted: false,
      content: "Latest advancements in AI technology.",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      title: "New Health Guidelines",
      category_id: (
        await knex("category").where("name", "Health").select("id").first()
      ).id,
      is_featured: false,
      is_deleted: false,
      content: "New WHO guidelines for a healthier life.",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
