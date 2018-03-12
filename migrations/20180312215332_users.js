exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists("users", function(table) {
      table.increments("userId");
      table.string("username", 255).notNullable();
      table.string("email", 255).notNullable();
      table.string("password", 255).notNullable();
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("users");
  };
  