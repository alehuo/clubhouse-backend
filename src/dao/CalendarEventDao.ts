import Knex from "knex";
import { ICalendarEvent } from "../models/ICalendarEvent";
import IDao from "./Dao";

const TABLE_NAME: string = "calendarEvents";

export default class CalendarEventDao implements IDao<ICalendarEvent> {
  constructor(private readonly knex: Knex) {}

  public findAll(): PromiseLike<ICalendarEvent[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }

  public findOne(eventId: number): PromiseLike<ICalendarEvent> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ eventId })
        .first()
    );
  }

  public findCalendarEventsByUser(userId: number): PromiseLike<ICalendarEvent[]> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .innerJoin("users", "users.userId", TABLE_NAME + ".addedBy")
        .where("users.userId", userId)
    );
  }

  public save(calendarEvent: ICalendarEvent): PromiseLike<number[]> {
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
