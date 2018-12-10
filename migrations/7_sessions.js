exports.up = function(knex, Promise) {
  return knex.schema.hasTable("sessions").then(exists => {
    if (!exists) {
      return knex.schema.createTable("sessions", table => {
        table.increments("sessionId");

        // User id
        table
          .integer("userId")
          .unsigned()
          .notNullable();

        // Messages
        table.string("startMessage", 4096);
        table.string("endMessage", 4096);

        // Start & end times of the session
        table
          .timestamp("startTime")
          .notNullable()
          .defaultTo(knex.fn.now());
        table.timestamp("endTime").defaultTo(knex.fn.now());

        table
          .integer("started", 1)
          .notNullable()
          .defaultTo(1);

        table
          .integer("ended", 1)
          .notNullable()
          .defaultTo(0);

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
  return knex.schema.hasTable("sessions").then(exists => {
    if (exists) {
      return knex.schema.dropTable("sessions");
    }
  });
};
