import Knex from "knex";

export async function up(knex: Knex) {
  const exists = await knex.schema.hasTable("locations");
  if (!exists) {
    await knex.schema.createTable("locations", (table) => {
      table.increments("locationId").unsigned();
      // Location name
      table.string("name", 255).notNullable();
      // Location address
      table.string("address", 255).notNullable();
      // Timestamp
      table.timestamps(true, true);
    });
  }
}

export async function down(knex: Knex) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  const exists = await knex.schema.hasTable("locations");
  if (exists) {
    await knex.schema.dropTable("locations");
  }
}
