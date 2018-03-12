exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("images", function(table) {
    table.increments("imageId");
    table
      .integer("folderId")
      .unsigned()
      .notNullable();
    table
      .foreign("folderId")
      .references("folderId")
      .inTable("folders");
    table.string("imageName", 256).notNullable();
    table.boolean("hidden").defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("images");
};