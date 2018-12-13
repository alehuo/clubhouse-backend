import { Message } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import { addTimestamps } from "../utils/TimestampGenerator";
import Dao from "./Dao";

const TABLE_NAME: string = "messages";

/**
 * DAO used to handle messages that people send to the system.
 */
export default class MessageDao implements Dao<Message> {
  constructor(private readonly knex: Knex) {}

  public findAll(): PromiseLike<Message[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }

  public findOne(messageId: number): PromiseLike<Message> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ messageId })
        .first()
    );
  }

  public findByUser(userId: number): PromiseLike<Message[]> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ userId })
    );
  }

  public findByDateBetween(
    startTime: Date,
    endTime?: Date
  ): PromiseLike<Message[]> {
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

  public save(message: Message): PromiseLike<number[]> {
    if (message.messageId) {
      delete message.messageId;
    }
    addTimestamps(message);
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
