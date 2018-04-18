exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("calendarEvents", function(table) {
    table.increments("eventId");
    // Event name
    table.string("name", 255).notNullable();
    // Description for the event
    table.string("description", 255).notNullable();
    // Is this a restricted event (for only the members of the student union)?
    table.boolean("restricted").defaultTo(false);
    // Start & end times
    table.timestamp("startTime");
    table.timestamp("endTime");
    // Added by (user)
    table.integer("addedBy").notNullable();
    // Union id
    table.integer("unionId").notNullable();
    // Location
    table.integer("locationId").notNullable();

    // Timestamp
    table.timestamps(true, true);

    table
      .foreign("locationId")
      .references("locationId")
      .inTable("locations");

    table
      .foreign("addedBy")
      .references("userId")
      .inTable("users");
    table
      .foreign("unionId")
      .references("unionId")
      .inTable("studentUnions");
  });
};

exports.down = function(knex, Promise) {
  if (process.env.NODE_ENV == "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  return knex.schema.dropTableIfExists("calendarEvents");
};
