import { Key } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import moment from "moment";

const keys: Key[] = [
  {
    keyId: 1,
    keyType: 1,
    userId: 1,
    unionId: 1,
    description: "Lorem ipsum",
    dateAssigned: moment().toISOString(),
    created_at: moment().toISOString(),
    updated_at: moment().toISOString()
  },
  {
    keyId: 2,
    keyType: 1,
    userId: 2,
    unionId: 2,
    description: "Key description",
    dateAssigned: moment().toISOString(),
    created_at: moment().toISOString(),
    updated_at: moment().toISOString()
  }
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("keys").del();
  // Insert data
  await knex("keys").insert(keys);
}
