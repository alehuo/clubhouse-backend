import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("newsposts").del();
  // Insert data
  await knex("newsposts").insert([
    {
      postId: 1,
      author: 1,
      title: "Welcome to our site",
      message: "Welcome to the new clubhouse management website."
    }
  ]);
}
