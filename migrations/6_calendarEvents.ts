import Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable("calendarEvents");
  if (!exists) {
    await knex.schema.createTable("calendarEvents", (table) => {
      table.increments("eventId");
      // Event name
      table.string("name", 255).notNullable();
      // Description for the event
      table.string("description", 255).notNullable();
      // Is this a restricted event (for only the members of the student union)?
      table.boolean("restricted").defaultTo(false);
      // Start & end times
      table
        .timestamp("startTime")
        .notNullable()
        .defaultTo(knex.fn.now());
      table
        .timestamp("endTime")
        .notNullable()
        .defaultTo(knex.fn.now());
      // Added by (user)
      table
        .integer("addedBy")
        .unsigned()
        .notNullable();
      // Union id
      table
        .integer("unionId")
        .unsigned()
        .notNullable();
      // Location
      table
        .integer("locationId")
        .unsigned()
        .notNullable();

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
  }
}

export async function down(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  const exists = await knex.schema.hasTable("calendarEvents");
  if (exists) {
    await knex.schema.dropTable("calendarEvents");
  }
}
