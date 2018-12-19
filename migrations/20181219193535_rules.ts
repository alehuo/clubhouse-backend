import Knex from "knex";

export async function up(knex: Knex) {
  const exists = await knex.schema.hasTable("rules");
  if (!exists) {
    await knex.schema.createTable("rules", function(table) {
      table.increments("ruleId");
      // Ordering
      table.integer("order");
      // Message
      table.string("text", 4096).notNullable();
      // Timestamp
      table.timestamps(true, true);
    });
  }
}

export async function down(knex: Knex) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  const exists = await knex.schema.hasTable("rules");
  if (exists) {
    await knex.schema.dropTable("rules");
  }
}
