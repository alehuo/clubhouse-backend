exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("locations", function(table) {
    table.increments("locationId");
    // Location name
    table.string("name", 255).notNullable();
    // Location address
    table.string("address", 255).notNullable();
    // Timestamp
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  if (process.env.NODE_ENV == "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  return knex.schema.dropTableIfExists("locations");
};
