exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("images", function(table) {
    table.increments("imageId");
    table
      .integer("userId")
      .unsigned()
      .notNullable();
    table
      .foreign("userId")
      .references("userId")
      .inTable("users");
    table.string("imageName", 256).notNullable();
    table.boolean("hidden").defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  if (process.env.NODE_ENV == "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  return knex.schema.dropTableIfExists("images");
};
