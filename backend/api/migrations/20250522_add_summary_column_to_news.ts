import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasTable("news").then((exists) => {
    if (exists) {
      return knex.schema.alterTable("news", (table) => {
        table.text("summary").nullable().after("content");
      });
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.hasTable("news").then((exists) => {
    if (exists) {
      return knex.schema.alterTable("news", (table) => {
        table.dropColumn("summary");
      });
    }
  });
}
