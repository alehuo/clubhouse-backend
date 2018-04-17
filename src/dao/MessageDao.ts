import IDao from "./Dao";
import Promise from "bluebird";
import * as Knex from "knex";
import IMessage from "../models/IMessage";

/**
 * DAO used to handle messages that people send to the system.
 */
export default class MessageDao implements IDao<IMessage> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<IMessage[]> {
    return this.knex("messages").select();
  }

  public findOne(messageId: number): Promise<IMessage[]> {
    return this.knex("messages")
      .select()
      .where({ messageId });
  }

  public findByUser(userId: number): Promise<IMessage[]> {
    return this.knex("messages")
      .select()
      .where({ userId });
  }

  public findByDateBetween(
    startTime: Date,
    endTime?: Date
  ): Promise<IMessage[]> {
    if (!endTime) {
      return this.knex("messages")
        .select()
        .whereBetween("timestamp", [startTime, new Date()]);
    } else {
      return this.knex("messages")
        .select()
        .whereBetween("timestamp", [startTime, endTime]);
    }
  }

  public save(message: IMessage): Promise<number[]> {
    return this.knex("messages").insert(message);
  }

  public remove(messageId: number): Promise<void> {
    return this.knex("messages")
      .delete()
      .where({ messageId });
  }
}
