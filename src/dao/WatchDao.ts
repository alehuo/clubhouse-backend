import IDao from "./Dao";
import * as Promise from "bluebird";
import * as Knex from "knex";
import IWatch from "../models/IWatch";

const TABLE_NAME = "watches";

/**
 * DAO used to handle watches.
 */
export default class WatchDao implements IDao<IWatch> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<IWatch[]> {
    return this.knex(TABLE_NAME).select();
  }
  public findAllOngoing(): Promise<IWatch[]> {
    return this.knex(TABLE_NAME)
      .select()
      .where("endTime", "IS", null);
  }
  public findOne(watchId: number): Promise<IWatch> {
    return this.knex(TABLE_NAME)
      .select()
      .where({ watchId })
      .first();
  }
  public findOngoingByUser(userId: number): Promise<IWatch[]> {
    return this.knex(TABLE_NAME)
      .select()
      .where({ userId })
      .andWhere("endTime", "IS", null);
  }
  public findByUser(userId: number): Promise<IWatch[]> {
    return this.knex(TABLE_NAME)
      .select()
      .where({ userId });
  }

  public save(watch: IWatch): Promise<number[]> {
    return this.knex(TABLE_NAME).insert(watch);
  }

  public endWatch(watchId: number, watch: IWatch): Promise<IWatch> {
    return this.knex(TABLE_NAME)
      .update({
        endTime: watch.endTime,
        endMessage: watch.endMessage
      })
      .where({ watchId });
  }

  public remove(watchId: number): Promise<boolean> {
    return this.knex(TABLE_NAME)
      .delete()
      .where({ watchId });
  }
}
