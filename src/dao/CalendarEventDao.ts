import { CalendarEvent } from "@alehuo/clubhouse-shared";
import knex from "../Database";
import moment from "moment";
import { dtFormat } from "../utils/DtFormat";
import Dao from "./Dao";

const TABLE_NAME = "calendarEvents";

class CalendarEventDao implements Dao<CalendarEvent> {
  public findAll(): PromiseLike<CalendarEvent[]> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .select()
        .orderBy("eventId", "ASC")
    );
  }

  public findOne(eventId: number): PromiseLike<CalendarEvent> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .select()
        .where({ eventId })
        .first()
    );
  }

  public findCalendarEventsByUser(
    userId: number
  ): PromiseLike<CalendarEvent[]> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .select()
        .innerJoin("users", "users.userId", TABLE_NAME + ".addedBy")
        .where("users.userId", userId)
    );
  }

  public save(calendarEvent: CalendarEvent): PromiseLike<number[]> {
    if (calendarEvent.eventId) {
      delete calendarEvent.eventId;
    }
    calendarEvent.created_at = moment().format(dtFormat);
    calendarEvent.updated_at = moment().format(dtFormat);
    return Promise.resolve(knex(TABLE_NAME).insert(calendarEvent));
  }

  public remove(eventId: number): PromiseLike<number> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .delete()
        .where({ eventId })
    );
  }
}

export default new CalendarEventDao()