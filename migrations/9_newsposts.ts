import Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable("newsposts");
  if (!exists) {
    await knex.schema.createTable("newsposts", function(table) {
      table.increments("postId");
      // Timestamp
      table.timestamps(true, true);
      // Author
      table
        .integer("author")
        .unsigned()
        .notNullable();
      // Title
      table.string("title", 4096).notNullable();
      // Message
      table.string("message", 4096).notNullable();

      // FK in users table
      table
        .foreign("author")
        .references("userId")
        .inTable("users");
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  const exists = await knex.schema.hasTable("newsposts");
  if (exists) {
    await knex.schema.dropTable("newsposts");
  }
}
