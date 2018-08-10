import * as Promise from "bluebird";
import * as Knex from "knex";
import IMessage from "../models/IMessage";
import IDao from "./Dao";

const TABLE_NAME = "messages";

/**
 * DAO used to handle messages that people send to the system.
 */
export default class MessageDao implements IDao<IMessage> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<IMessage[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }

  public findOne(messageId: number): Promise<IMessage> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ messageId })
        .first()
    );
  }

  public findByUser(userId: number): Promise<IMessage[]> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ userId })
    );
  }

  public findByDateBetween(
    startTime: Date,
    endTime?: Date
  ): Promise<IMessage[]> {
    if (!endTime) {
      return Promise.resolve(
        this.knex(TABLE_NAME)
          .select()
          .whereBetween("timestamp", [startTime, new Date()])
      );
    } else {
      return Promise.resolve(
        this.knex(TABLE_NAME)
          .select()
          .whereBetween("timestamp", [startTime, endTime])
      );
    }
  }

  public save(message: IMessage): Promise<number[]> {
    return Promise.resolve(this.knex(TABLE_NAME).insert(message));
  }

  public remove(messageId: number): Promise<boolean> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .delete()
        .where({ messageId })
    );
  }
}
