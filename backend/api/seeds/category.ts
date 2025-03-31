import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("category").del();

  // Inserts seed entries
  await knex("category").insert([
    {
      id: uuidv4(),
      name: "Technology",
      description: "All news related to technology advancements.",
      show_online: true,
      created_at: new Date(),
    },
    {
      id: uuidv4(),
      name: "Health",
      description: "Health and wellness news and tips.",
      show_online: true,
      created_at: new Date(),
    },
  ]);
}
