import { Session } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import moment from "moment";
import Dao from "./Dao";
import { dtFormat } from "../index";

const TABLE_NAME = "sessions";

/**
 * DAO used to handle sessions.
 */
export default class SessionDao implements Dao<Session> {
  constructor(private readonly knex: Knex) {}

  public findAll(): PromiseLike<Session[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }
  public findAllOngoing(): PromiseLike<Session[]> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where("ended", "=", 0)
    );
  }
  public findOne(sessionId: number): PromiseLike<Session> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ sessionId })
        .first()
    );
  }
  public findOngoingByUser(userId: number): PromiseLike<Session[]> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ userId })
        .andWhere("ended", "=", 0)
    );
  }
  public findByUser(userId: number): PromiseLike<Session[]> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ userId })
    );
  }

  public save(session: Session): PromiseLike<number[]> {
    if (session.sessionId) {
      delete session.sessionId;
    }
    session.created_at = moment().format(dtFormat);
    session.updated_at = moment().format(dtFormat);
    return Promise.resolve(this.knex(TABLE_NAME).insert(session));
  }

  public endSession(
    sessionId: number,
    endMessage: string
  ): PromiseLike<Session> {
    const currentTimestamp = moment().format(dtFormat);
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .update({
          endTime: currentTimestamp,
          endMessage,
          ended: 1,
          updated_at: currentTimestamp
        })
        .where({ sessionId })
    );
  }

  public remove(sessionId: number): PromiseLike<boolean> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .delete()
        .where({ sessionId })
    );
  }
}
