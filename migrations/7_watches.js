exports.up = function(knex, Promise) {
  return knex.schema.hasTable("watches").then(exists => {
    if (!exists) {
      return knex.schema.createTable("watches", table => {
        table.increments("watchId");

        // User id
        table.integer("userId").notNullable();

        // Messages
        table.string("startMessage", 4096);
        table.string("endMessage", 4096);

        // Start & end times of the watch
        table.timestamp("startTime").notNullable();
        table.timestamp("endTime");

        // FK in users table
        table
          .foreign("userId")
          .references("userId")
          .inTable("users");

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
  return knex.schema.hasTable("watches").then(exists => {
    if (exists) {
      return knex.schema.dropTable("watches");
    }
  });
};
