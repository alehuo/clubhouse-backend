exports.up = function(knex, Promise) {
  return knex.schema.hasTable("studentUnions").then(exists => {
    if (!exists) {
      return knex.schema.createTable("studentUnions", table => {
        table.increments("unionId").unsigned();
        table.string("name", 255).notNullable();
        table.string("description", 255).notNullable();
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
  return knex.schema.hasTable("studentUnions").then(exists => {
    if (exists) {
      return knex.schema.dropTable("studentUnions");
    }
  });
};
