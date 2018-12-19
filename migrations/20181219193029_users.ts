import Knex from "knex";

export async function up(knex: Knex) {
  const exists = await knex.schema.hasTable("users");
  if (!exists) {
    await knex.schema.createTable("users", (table) => {
      table.increments("userId");
      table.string("email", 255).notNullable();
      table.string("password", 255).notNullable();
      table.string("firstName", 255).notNullable();
      table.string("lastName", 255).notNullable();
      table
        .integer("permissions")
        .notNullable()
        .defaultTo(8);
      // Timestamp
      table.timestamps(true, true);
      table.unique(["email"]);
    });
  }
}

export async function down(knex: Knex) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  const exists = knex.schema.hasTable("users");
  if (exists) {
    await knex.schema.dropTable("users");
  }
}
