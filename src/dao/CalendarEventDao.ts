import { CalendarEvent } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import { addTimestamps } from "../utils/TimestampGenerator";
import Dao from "./Dao";

const TABLE_NAME: string = "calendarEvents";

export default class CalendarEventDao implements Dao<CalendarEvent> {
  constructor(private readonly knex: Knex) {}

  public findAll(): PromiseLike<CalendarEvent[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }

  public findOne(eventId: number): PromiseLike<CalendarEvent> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ eventId })
        .first()
    );
  }

  public findCalendarEventsByUser(
    userId: number
  ): PromiseLike<CalendarEvent[]> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .innerJoin("users", "users.userId", TABLE_NAME + ".addedBy")
        .where("users.userId", userId)
    );
  }

  public save(calendarEvent: CalendarEvent): PromiseLike<number[]> {
    if (calendarEvent.eventId) {
      delete calendarEvent.eventId;
    }
    addTimestamps(calendarEvent);
    return Promise.resolve(this.knex(TABLE_NAME).insert(calendarEvent));
  }

  public remove(eventId: number): PromiseLike<boolean> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .delete()
        .where({ eventId })
    );
  }
}
