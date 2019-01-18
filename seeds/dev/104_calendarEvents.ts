import { CalendarEvent } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import moment from "moment";
import { dtFormat } from "../../src/utils/DtFormat";

const events: CalendarEvent[] = [
  {
    eventId: 1,
    name: "Friday hangouts",
    description: "Friday hangouts at our clubhouse",
    restricted: 0,
    startTime: moment().format(dtFormat),
    endTime: moment()
      .add(3, "hours")
      .toISOString(),
    addedBy: 1,
    unionId: 1,
    locationId: 2,
    created_at: moment().format(dtFormat),
    updated_at: moment().format(dtFormat)
  },
  {
    eventId: 2,
    name: "Board meeting",
    description: "Board meeting",
    restricted: 0,
    startTime: moment().format(dtFormat),
    endTime: moment()
      .add(3, "hours")
      .toISOString(),
    addedBy: 1,
    unionId: 1,
    locationId: 1,
    created_at: moment().format(dtFormat),
    updated_at: moment().format(dtFormat)
  }
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("calendarEvents").del();
  // Insert data
  await knex("calendarEvents").insert(events);
}
