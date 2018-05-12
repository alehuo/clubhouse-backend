exports.up = function(knex, Promise) {
  return knex.schema.hasTable("newsposts").then(exists => {
    if (!exists) {
      return knex.schema.createTable("newsposts", function(table) {
        table.increments("postId");
        // Timestamp
        table.timestamps(true, true);
        // Author
        table.integer("author").unsigned().notNullable();
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
  });
};

exports.down = function(knex, Promise) {
  if (process.env.NODE_ENV == "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  return knex.schema.hasTable("newsposts").then(exists => {
    if (exists) {
      return knex.schema.dropTable("newsposts");
    }
  });
};
