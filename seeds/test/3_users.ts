import bcrypt from "bcrypt";
import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();
  // Generate salt
  const salt = await bcrypt.genSalt(10);
  // Insert data
  await knex("users").insert([
    {
      userId: 1,
      email: "testuser@email.com",
      firstName: "Test",
      lastName: "User",
      permissions: 67108863,
      password: bcrypt.hashSync("testuser", salt)
    },
    {
      userId: 2,
      email: "testuser2@email.com",
      firstName: "Test2",
      lastName: "User2",
      permissions: 8,
      password: bcrypt.hashSync("testuser2", salt)
    }
  ]);
}
