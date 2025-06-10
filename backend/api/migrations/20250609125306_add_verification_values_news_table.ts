import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("news", (table) => {
    // Verification status
    table.boolean("is_verified").defaultTo(false);
    table.jsonb("verification_data").nullable();
    table.timestamp("verified_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("news", (table) => {
    table.dropColumn("is_verified");
    table.dropColumn("verification_data");
    table.dropColumn("verified_at");
  });
}
