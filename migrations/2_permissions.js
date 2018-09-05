exports.up = function(knex, Promise) {
  return knex.schema.hasTable("permissions").then(exists => {
    if (!exists) {
      return knex.schema.createTable("permissions", table => {
        // Primary key
        table.increments("permissionId").unsigned();
        // Role id
        table.string("name");
        table.integer("value");
        // Timestamp
        table.timestamps(true, true);
        table.unique(["value"]);
      });
    }
  });
};

exports.down = function(knex, Promise) {
  if (process.env.NODE_ENV == "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  return knex.schema.hasTable("permissions").then(exists => {
    if (exists) {
      return knex.schema.dropTable("permissions");
    }
  });
};
