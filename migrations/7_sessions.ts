import Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable("sessions");
  if (!exists) {
    await knex.schema.createTable("sessions", (table) => {
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
        .integer("started")
        .notNullable()
        .defaultTo(1);

      table
        .integer("ended")
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
}

export async function down(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  const exists = await knex.schema.hasTable("sessions");
  if (exists) {
    await knex.schema.dropTable("sessions");
  }
}
