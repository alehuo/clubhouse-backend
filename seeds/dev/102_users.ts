import { DbUser } from "@alehuo/clubhouse-shared";
import bcrypt from "bcrypt";
import Knex from "knex";
import moment from "moment";
import { dtFormat } from "../../src/utils/DtFormat";

// Generate salt
const salt = bcrypt.genSaltSync(10);

const users: DbUser[] = [
  {
    userId: 1,
    email: "testuser@email.com",
    firstName: "Test",
    lastName: "User",
    permissions: 524287,
    password: bcrypt.hashSync("testuser", salt),
    created_at: moment().format(dtFormat),
    updated_at: moment().format(dtFormat)
  },
  {
    userId: 2,
    email: "testuser2@email.com",
    firstName: "Test2",
    lastName: "User2",
    permissions: 8,
    password: bcrypt.hashSync("testuser2", salt),
    created_at: moment().format(dtFormat),
    updated_at: moment().format(dtFormat)
  }
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();
  // Insert data
  await knex("users").insert(users);
}
