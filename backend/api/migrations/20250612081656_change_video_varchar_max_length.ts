import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("news", (table) => {
    table.text("video", "longtext").nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("news", (table) => {
    table.string("video").nullable().alter();
  });
}
