import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("locations").del();
  // Insert data
  await knex("locations").insert([
    { locationId: 1, name: "Meeting room", address: "Street Addr 1" },
    { locationId: 2, name: "Club", address: "Street Addr 1" },
    { locationId: 3, name: "Club 2", address: "Street Addr 2" },
    { locationId: 4, name: "Club 3", address: "Street Addr 3" }
  ]);
}
