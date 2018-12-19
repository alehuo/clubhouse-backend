import { CalendarEvent } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import moment from "moment";

const events: CalendarEvent[] = [
  {
    eventId: 1,
    name: "Friday hangouts",
    description: "Friday hangouts at our clubhouse",
    restricted: 0,
    startTime: moment(new Date(2018, 3, 23, 18, 0, 0)).toISOString(),
    endTime: moment(new Date(2018, 3, 24, 2, 0, 0)).toISOString(),
    addedBy: 1,
    unionId: 1,
    locationId: 2,
    created_at: moment().toISOString(),
    updated_at: moment().toISOString()
  },
  {
    eventId: 2,
    name: "Board meeting",
    description: "Board meeting",
    restricted: 0,
    startTime: moment(new Date(2018, 3, 23, 18, 0, 0)).toISOString(),
    endTime: moment(new Date(2018, 3, 24, 2, 0, 0)).toISOString(),
    addedBy: 1,
    unionId: 1,
    locationId: 1,
    created_at: moment().toISOString(),
    updated_at: moment().toISOString()
  }
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("calendarEvents").del();
  // Insert data
  await knex("calendarEvents").insert(events);
}
