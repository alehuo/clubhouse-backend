import Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable("studentUnions");
  if (!exists) {
    await knex.schema.createTable("studentUnions", (table) => {
      table.increments("unionId").unsigned();
      table.string("name", 255).notNullable();
      table.string("description", 255).notNullable();
      // Timestamp
      table.timestamps(true, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  const exists = await knex.schema.hasTable("studentUnions");
  if (exists) {
    await knex.schema.dropTable("studentUnions");
  }
}
