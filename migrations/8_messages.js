exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("messages", function(table) {
    table.increments("messageId");
    // Timestamp
    table.timestamp("timestamp").notNullable();
    // User id
    table.integer("userId").notNullable();
    // Message
    table.string("message", 4096).notNullable();

    // FK in users table
    table
      .foreign("userId")
      .references("userId")
      .inTable("users");
  });
};

exports.down = function(knex, Promise) {
  if (process.env.NODE_ENV == "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  return knex.schema.dropTableIfExists("messages");
};
