import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable("users", function (table) {
      table.uuid("id").primary();
      table.string("name").notNullable();
      table.string("email").unique().notNullable();
      table.string("password").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    })
    .createTable("category", function (table) {
      table.uuid("id").primary();
      table.string("name").notNullable();
      table.text("description");
      table.boolean("show_online").defaultTo(true);
      table.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("news", function (table) {
      table.uuid("id").primary();
      table.string("title").notNullable();
      table
        .uuid("category_id")
        .references("id")
        .inTable("category")
        .onDelete("CASCADE");
      table.string("subtitle");
      table.boolean("is_featured").defaultTo(false);
      table.boolean("is_deleted").defaultTo(false);
      table.integer("number_of_clicks").defaultTo(0);
      table.text("content").notNullable();
      table.string("image");
      table.string("video");
      table.timestamp("expire_date");
      table.uuid("updated_by").references("id").inTable("users");
      table.uuid("created_by").references("id").inTable("users");
      table.timestamps(true, true);
      table.string("tags");
    })
    .createTable("reactions", function (table) {
      table.uuid("id").primary();
      table
        .uuid("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .uuid("news_id")
        .references("id")
        .inTable("news")
        .onDelete("CASCADE");
      table.integer("reaction").notNullable();
    })
    .createTable("refresh_tokens", function (table) {
      table.uuid("id").primary();
      table.string("jwt_id").notNullable();
      table.string("token").notNullable();
      table.boolean("is_revoked").defaultTo(false);
      table.timestamp("date_added").defaultTo(knex.fn.now());
      table.timestamp("date_expires").notNullable();
      table
        .uuid("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
    })
    .createTable("saved_news", function (table) {
      table.uuid("id").primary();
      table
        .uuid("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .uuid("news_id")
        .references("id")
        .inTable("news")
        .onDelete("CASCADE");
    })
    .createTable("watched", function (table) {
      table.uuid("id").primary();
      table
        .uuid("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .uuid("news_id")
        .references("id")
        .inTable("news")
        .onDelete("CASCADE");
      table.string("fingerprint_id");
      table.timestamp("watched_on").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists("watched")
    .dropTableIfExists("saved_news")
    .dropTableIfExists("refresh_tokens")
    .dropTableIfExists("reactions")
    .dropTableIfExists("news")
    .dropTableIfExists("category")
    .dropTableIfExists("users");
}
