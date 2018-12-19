import { Location } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import moment from "moment";

const locations: Location[] = [
  {
    locationId: 1,
    name: "Meeting room",
    address: "Street Addr 1",
    created_at: moment().toISOString(),
    updated_at: moment().toISOString()
  },
  {
    locationId: 2,
    name: "Club",
    address: "Street Addr 1",
    created_at: moment().toISOString(),
    updated_at: moment().toISOString()
  }
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("locations").del();
  // Insert data
  await knex("locations").insert(locations);
}
