import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("news", (table) => {
    table.text("image", "longtext").alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("news", (table) => {
    table.string("image", 255).alter();
  });
}
