import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Create roles table
  await knex.schema.createTable("roles", (table) => {
    table.uuid("id").primary();
    table.string("name", 50).notNullable().unique();
    table.string("description", 255);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // Create user_roles junction table
  await knex.schema.createTable("user_roles", (table) => {
    table.uuid("user_id").notNullable();
    table.uuid("role_id").notNullable();
    table.primary(["user_id", "role_id"]);
    table.foreign("role_id").references("roles.id").onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // Insert default roles
  await knex("roles").insert([
    {
      id: knex.raw("UUID()"),
      name: "admin",
      description: "Administrator with full access",
    },
    {
      id: knex.raw("UUID()"),
      name: "registered",
      description: "Regular user with limited access",
    },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  // Drop tables in reverse order
  await knex.schema.dropTableIfExists("user_roles");
  await knex.schema.dropTableIfExists("roles");
}
