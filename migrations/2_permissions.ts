import Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable("permissions");
  if (!exists) {
    await knex.schema.createTable("permissions", (table) => {
      // Primary key
      table.increments("permissionId").unsigned();
      // Role id
      table.string("name");
      table.integer("value");
      // Timestamp
      table.timestamps(true, true);
      table.unique(["value"]);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  const exists = await knex.schema.hasTable("permissions");
  if (exists) {
    await knex.schema.dropTable("permissions");
  }
}
