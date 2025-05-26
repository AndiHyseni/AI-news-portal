import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("news_config", (table) => {
    table.boolean("show_chatbot").defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("news_config", (table) => {
    table.dropColumn("show_chatbot");
  });
}
