import { Message } from "@alehuo/clubhouse-shared";
import knex from "../Database";
import moment from "moment";
import { dtFormat } from "../utils/DtFormat";
import Dao from "./Dao";

const TABLE_NAME = "messages";

/**
 * DAO used to handle messages that people send to the system.
 */
class MessageDao implements Dao<Message> {
  public findAll(): PromiseLike<Message[]> {
    return Promise.resolve(knex(TABLE_NAME).select());
  }

  public findOne(messageId: number): PromiseLike<Message> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .select()
        .where({ messageId })
        .first()
    );
  }

  public findByUser(userId: number): PromiseLike<Message[]> {
    return Promise.resolve(
      knex(TABLE_NAME)
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
        knex(TABLE_NAME)
          .select()
          .whereBetween("timestamp", [startTime, new Date()])
      );
    } else {
      return Promise.resolve(
        knex(TABLE_NAME)
          .select()
          .whereBetween("timestamp", [startTime, endTime])
      );
    }
  }

  public save(message: Message): PromiseLike<number[]> {
    if (message.messageId) {
      delete message.messageId;
    }
    message.created_at = moment().format(dtFormat);
    message.updated_at = moment().format(dtFormat);
    return Promise.resolve(knex(TABLE_NAME).insert(message));
  }

  public remove(messageId: number): PromiseLike<number> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .delete()
        .where({ messageId })
    );
  }
}

export default new MessageDao();
