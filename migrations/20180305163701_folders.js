exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("folders", function(table) {
    table.increments("folderId");
    table.string("folderName", 64).notNullable();
    table.boolean("hidden").defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("folders");
};
