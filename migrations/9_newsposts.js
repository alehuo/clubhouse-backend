exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("newsposts", function(table) {
    table.increments("postId");
    // Timestamp
    table.timestamps(true, true);
    // Author
    table.integer("author").notNullable();
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
};

exports.down = function(knex, Promise) {
  if (process.env.NODE_ENV == "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  return knex.schema.dropTableIfExists("newsposts");
};
