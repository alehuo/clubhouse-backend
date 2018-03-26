exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("users", function(table) {
    table.increments("userId");
    table.string("username", 255).notNullable();
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
      .integer("roleId")
      .notNullable()
      .defaultTo(2);
    table
      .foreign("roleId")
      .references("roleId")
      .inTable("roles");
  });
};

exports.down = function(knex, Promise) {
  if (process.env.NODE_ENV == "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  return knex.schema.dropTableIfExists("users");
};
