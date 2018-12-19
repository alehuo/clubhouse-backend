import { Session } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import moment from "moment";

const sessions: Session[] = [
  {
    sessionId: 1,
    userId: 1,
    startMessage: "Let's get this party started.",
    endMessage:
      "I have left the building. Moved people under my supervision to another keyholder.",
    startTime: moment(new Date(2017, 6, 1, 0, 0)).toISOString(),
    endTime: moment(new Date(2017, 6, 1, 0, 10)).toISOString(),
    started: 1,
    ended: 1,
    created_at: moment().toISOString(),
    updated_at: moment().toISOString()
  },
  {
    sessionId: 2,
    userId: 1,
    startMessage:
      "Good evening, I'm taking responsibility of a few exchange students.",
    endMessage: "",
    startTime: moment(new Date(2018, 6, 1, 23, 58)).toISOString(),
    endTime: "",
    started: 1,
    ended: 0,
    created_at: moment().toISOString(),
    updated_at: moment().toISOString()
  }
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("sessions").del();
  // Insert data
  await knex("sessions").insert(sessions);
}
