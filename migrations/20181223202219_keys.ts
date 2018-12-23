import Knex from "knex";

export async function up(knex: Knex) {
  const exists = await knex.schema.hasTable("keys");
  if (!exists) {
    await knex.schema.createTable("keys", function(table) {
      // keyId
      table.increments("keyId");

      // keyType
      table.integer("keyType").unsigned();

      // userId
      table.integer("userId").unsigned();

      // unionId
      table.integer("unionId").unsigned();

      // description
      table.string("description", 4096);

      // dateAssigned
      table.timestamp("dateAssigned").defaultTo(knex.fn.now());

      // Timestamp
      table.timestamps(true, true);

      table.foreign("keyType").references("keyTypes.keyTypeId");

      table.foreign("userId").references("users.userId");

      table.foreign("unionId").references("studentUnions.unionId");
    });
  }
}

export async function down(knex: Knex) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  const exists = await knex.schema.hasTable("keys");
  if (exists) {
    await knex.schema.dropTable("keys");
  }
}
