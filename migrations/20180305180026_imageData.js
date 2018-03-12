exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("imageData", function(table) {
    table.increments("imageDataId");
    table
      .integer("imageId")
      .unsigned()
      .notNullable();
    table
      .foreign("imageId")
      .references("imageId")
      .inTable("images");
    table.string("contentType", 255).notNullable();
    table.string("imagePath", 8192).notNullable();
    table.enu("dataType", ["thumbnail", "full"]);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("imageData");
};
