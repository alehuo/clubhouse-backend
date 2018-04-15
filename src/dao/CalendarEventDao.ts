import IDao from "./Dao";
import Promise from "bluebird";
import * as Knex from "knex";
import ICalendarEvent from "../models/ICalendarEvent";

export default class CalendarEventDao implements IDao<ICalendarEvent> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<ICalendarEvent[]> {
    return this.knex("calendarEvents").select();
  }

  public findOne(eventId: number): Promise<ICalendarEvent[]> {
    return this.knex("calendarEvents")
      .select()
      .where({ eventId });
  }

  public findCalendarEventsByUser(userId: number): Promise<ICalendarEvent[]> {
    return this.knex("calendarEvents")
      .select()
      .innerJoin("users", "users.userId", "calendarEvents.addedBy")
      .where("users.userId", userId);
  }

  public save(calendarEvent: ICalendarEvent): Promise<ICalendarEvent> {
    return this.knex("calendarEvents").insert(calendarEvent);
  }

  public remove(eventId: number): Promise<void> {
    return this.knex("calendarEvents")
      .delete()
      .where({ eventId });
  }
}
