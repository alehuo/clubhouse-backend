exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("roles", function(table) {
    table.increments("roleId");
    table.string("name", 255).notNullable();
    table.string("description", 255).notNullable();
  });
};

exports.down = function(knex, Promise) {
  if (process.env.NODE_ENV == "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  return knex.schema.dropTableIfExists("roles");
};
