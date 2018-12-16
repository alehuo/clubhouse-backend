import { CalendarEvent } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import moment from "moment";
import Dao from "./Dao";

const TABLE_NAME = "calendarEvents";

export default class CalendarEventDao implements Dao<CalendarEvent> {
  constructor(private readonly knex: Knex) {}

  public findAll(): PromiseLike<CalendarEvent[]> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .orderBy("eventId", "ASC")
    );
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
    calendarEvent.created_at = moment().toISOString();
    calendarEvent.updated_at = moment().toISOString();
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
