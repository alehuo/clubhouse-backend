exports.up = function(knex, Promise) {
  return knex.schema.hasTable("users").then(exists => {
    if (!exists) {
      return knex.schema.createTable("users", table => {
        table.increments("userId");
        table.string("email", 255).notNullable();
        table.string("password", 255).notNullable();
        table.string("firstName", 255).notNullable();
        table.string("lastName", 255).notNullable();
        table.integer("unionId");
        table
          .foreign("unionId")
          .references("unionId")
          .inTable("studentUnions");
        table
          .integer("permissions")
          .notNullable()
          .defaultTo(8);
        // Timestamp
        table.timestamps(true, true);
      });
    }
  });
};

exports.down = function(knex, Promise) {
  if (process.env.NODE_ENV == "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  return knex.schema.hasTable("users").then(exists => {
    if (exists) {
      return knex.schema.dropTable("users");
    }
  });
};
