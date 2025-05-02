import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("news_config", (table) => {
    table.uuid("id").primary();
    table.string("header_logo").nullable();
    table.string("footer_logo").nullable();
    table.boolean("show_featured").notNullable().defaultTo(true);
    table.boolean("show_most_watched").notNullable().defaultTo(true);
    table.boolean("show_related_news").notNullable().defaultTo(true);
    table.timestamps(true, true);
  });

  // Insert default configuration
  await knex("news_config").insert({
    id: knex.raw("UUID()"),
    show_featured: true,
    show_most_watched: true,
    show_related_news: true,
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("news_config");
}
