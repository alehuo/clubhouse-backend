import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("studentUnions").del();
  await knex("studentUnions").insert([
    { unionId: 1, name: "Union 1", description: "Union 1 description" },
    { unionId: 2, name: "Union 2", description: "Union 2 description" },
    { unionId: 3, name: "Union 3", description: "Union 3 description" },
    { unionId: 4, name: "Union 4", description: "Union 4 description" },
    { unionId: 5, name: "Union 5", description: "Union 5 description" }
  ]);
}
