import { Session } from "@alehuo/clubhouse-shared";
import knex from "../Database";
import moment from "moment";
import { dtFormat } from "../utils/DtFormat";
import Dao from "./Dao";

const TABLE_NAME = "sessions";

/**
 * DAO used to handle sessions.
 */
class SessionDao implements Dao<Session> {
  public findAll(): PromiseLike<Session[]> {
    return Promise.resolve(knex(TABLE_NAME).select());
  }
  public findAllOngoing(): PromiseLike<Session[]> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .select()
        .where("ended", "=", 0)
    );
  }
  public findOne(sessionId: number): PromiseLike<Session> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .select()
        .where({ sessionId })
        .first()
    );
  }
  public findOngoingByUser(userId: number): PromiseLike<Session[]> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .select()
        .where({ userId })
        .andWhere("ended", "=", 0)
    );
  }
  public findByUser(userId: number): PromiseLike<Session[]> {
    return Promise.resolve(
      knex(TABLE_NAME)
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
    return Promise.resolve(knex(TABLE_NAME).insert(session));
  }

  public endSession(
    sessionId: number,
    endMessage: string
  ): PromiseLike<number> {
    const currentTimestamp = moment().format(dtFormat);
    return Promise.resolve(
      knex(TABLE_NAME)
        .update({
          endTime: currentTimestamp,
          endMessage,
          ended: 1,
          updated_at: currentTimestamp
        })
        .where({ sessionId })
    );
  }

  public remove(sessionId: number): PromiseLike<number> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .delete()
        .where({ sessionId })
    );
  }
}

export default new SessionDao();
