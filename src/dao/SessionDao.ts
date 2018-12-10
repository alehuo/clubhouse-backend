import Knex from "knex";
import { ISession } from "../models/ISession";
import IDao from "./Dao";

const TABLE_NAME: string = "sessions";

/**
 * DAO used to handle sessions.
 */
export default class SessionDao implements IDao<ISession> {
  constructor(private readonly knex: Knex) {}

  public findAll(): PromiseLike<ISession[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }
  public findAllOngoing(): PromiseLike<ISession[]> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where("ended", "=", 0)
    );
  }
  public findOne(sessionId: number): PromiseLike<ISession> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ sessionId })
        .first()
    );
  }
  public findOngoingByUser(userId: number): PromiseLike<ISession[]> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ userId })
        .andWhere("ended", "=", 0)
    );
  }
  public findByUser(userId: number): PromiseLike<ISession[]> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ userId })
    );
  }

  public save(session: ISession): PromiseLike<number[]> {
    return Promise.resolve(this.knex(TABLE_NAME).insert(session));
  }

  public endSession(
    sessionId: number,
    session: ISession
  ): PromiseLike<ISession> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .update({
          endTime: session.endTime,
          endMessage: session.endMessage,
          ended: 1
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
