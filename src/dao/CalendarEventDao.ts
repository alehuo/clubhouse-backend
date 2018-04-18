import IDao from "./Dao";
import Promise from "bluebird";
import * as Knex from "knex";
import ICalendarEvent from "../models/ICalendarEvent";

const TABLE_NAME = "calendarEvents";

export default class CalendarEventDao implements IDao<ICalendarEvent> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<ICalendarEvent[]> {
    return this.knex(TABLE_NAME).select();
  }

  public findOne(eventId: number): Promise<ICalendarEvent[]> {
    return this.knex(TABLE_NAME)
      .select()
      .where({ eventId });
  }

  public findCalendarEventsByUser(userId: number): Promise<ICalendarEvent[]> {
    return this.knex(TABLE_NAME)
      .select()
      .innerJoin("users", "users.userId", TABLE_NAME + ".addedBy")
      .where("users.userId", userId);
  }

  public save(calendarEvent: ICalendarEvent): Promise<number[]> {
    return this.knex(TABLE_NAME).insert(calendarEvent);
  }

  public remove(eventId: number): Promise<void> {
    return this.knex(TABLE_NAME)
      .delete()
      .where({ eventId });
  }
}
