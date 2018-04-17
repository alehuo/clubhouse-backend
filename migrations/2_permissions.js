exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("permissions", function(table) {
    // Primary key
    table.increments("permissionId");
    // Role id
    table.string("name");
    table.integer("value");
    // Timestamp
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  if (process.env.NODE_ENV == "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  return knex.schema.dropTableIfExists("permissions");
};
