import { KeyType } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import moment from "moment";

const keyTypes: KeyType[] = [
  {
    keyTypeId: 1,
    title: "24hr",
    created_at: moment().toISOString(),
    updated_at: moment().toISOString()
  },
  {
    keyTypeId: 2,
    title: "Day",
    created_at: moment().toISOString(),
    updated_at: moment().toISOString()
  },
  {
    keyTypeId: 3,
    title: "Test key",
    created_at: moment().toISOString(),
    updated_at: moment().toISOString()
  }
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("keyTypes").del();
  // Insert data
  await knex("keyTypes").insert(keyTypes);
}
