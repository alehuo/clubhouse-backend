import Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable("messages");
  if (!exists) {
    await knex.schema.createTable("messages", function(table) {
      table.increments("messageId");
      // Timestamp
      table.timestamps(true, true);
      // User id
      table
        .integer("userId")
        .unsigned()
        .notNullable();
      // Title
      table.string("title", 256).notNullable();
      // Message
      table.string("message", 4096).notNullable();

      // FK in users table
      table
        .foreign("userId")
        .references("userId")
        .inTable("users");
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  const exists = await knex.schema.hasTable("messages");
  if (exists) {
    await knex.schema.dropTable("messages");
  }
}
