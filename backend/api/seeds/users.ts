import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    {
      id: uuidv4(),
      name: "John Doe",
      email: "john.doe@example.com",
      password: "$2a$10$Np3AR7vnQy5.yu76bz7ZROtHl7u5/VhPJG74jLrqHvXFoqnh6rKY.",
      created_at: new Date(),
    },
    {
      id: uuidv4(),
      name: "Andi Hyseni",
      email: "hyseniandi6@gmail.com",
      password: "$2a$10$Np3AR7vnQy5.yu76bz7ZROtHl7u5/VhPJG74jLrqHvXFoqnh6rKY.",
      created_at: new Date(),
    },
  ]);
}
