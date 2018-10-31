import Knex from "knex";
import { IMessage } from "../models/IMessage";
import IDao from "./Dao";

const TABLE_NAME: string = "messages";

/**
 * DAO used to handle messages that people send to the system.
 */
export default class MessageDao implements IDao<IMessage> {
  constructor(private readonly knex: Knex) {}

  public findAll(): PromiseLike<IMessage[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }

  public findOne(messageId: number): PromiseLike<IMessage> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ messageId })
        .first()
    );
  }

  public findByUser(userId: number): PromiseLike<IMessage[]> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ userId })
    );
  }

  public findByDateBetween(
    startTime: Date,
    endTime?: Date
  ): PromiseLike<IMessage[]> {
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

  public save(message: IMessage): PromiseLike<number[]> {
    return Promise.resolve(this.knex(TABLE_NAME).insert(message));
  }

  public remove(messageId: number): PromiseLike<boolean> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .delete()
        .where({ messageId })
    );
  }
}
