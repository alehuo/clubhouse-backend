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
  },
  {
    locationId: 3,
    name: "Club 2",
    address: "Street Addr 2",
    created_at: moment().toISOString(),
    updated_at: moment().toISOString()
  },
  {
    locationId: 4,
    name: "Club 3",
    address: "Street Addr 3",
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
