import Knex from "knex";

export async function up(knex: Knex) {
  const exists = await knex.schema.hasTable("keyTypes");
  if (!exists) {
    await knex.schema.createTable("keyTypes", function(table) {
      table.increments("keyTypeId");
      // Message
      table.string("title", 4096).notNullable();
      // Timestamp
      table.timestamps(true, true);
    });
  }
}

export async function down(knex: Knex) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  const exists = await knex.schema.hasTable("keyTypes");
  if (exists) {
    await knex.schema.dropTable("keyTypes");
  }
}
