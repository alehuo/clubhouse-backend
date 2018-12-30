import { Key } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import moment from "moment";
import { dtFormat } from "../../src/index";

const keys: Key[] = [
  {
    keyId: 1,
    keyType: 1,
    userId: 1,
    unionId: 1,
    description: "Lorem ipsum",
    dateAssigned: moment().format(dtFormat),
    created_at: moment().format(dtFormat),
    updated_at: moment().format(dtFormat)
  },
  {
    keyId: 2,
    keyType: 1,
    userId: 2,
    unionId: 2,
    description: "Key description",
    dateAssigned: moment().format(dtFormat),
    created_at: moment().format(dtFormat),
    updated_at: moment().format(dtFormat)
  }
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("keys").del();
  // Insert data
  await knex("keys").insert(keys);
}
