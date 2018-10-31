import Knex from "knex";
import { IWatch } from "../models/IWatch";
import IDao from "./Dao";

const TABLE_NAME: string = "watches";

/**
 * DAO used to handle watches.
 */
export default class WatchDao implements IDao<IWatch> {
  constructor(private readonly knex: Knex) {}

  public findAll(): PromiseLike<IWatch[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }
  public findAllOngoing(): PromiseLike<IWatch[]> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where("ended", "=", 0)
    );
  }
  public findOne(watchId: number): PromiseLike<IWatch> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ watchId })
        .first()
    );
  }
  public findOngoingByUser(userId: number): PromiseLike<IWatch[]> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ userId })
        .andWhere("ended", "=", 0)
    );
  }
  public findByUser(userId: number): PromiseLike<IWatch[]> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ userId })
    );
  }

  public save(watch: IWatch): PromiseLike<number[]> {
    return Promise.resolve(this.knex(TABLE_NAME).insert(watch));
  }

  public endWatch(watchId: number, watch: IWatch): PromiseLike<IWatch> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .update({
          endTime: watch.endTime,
          endMessage: watch.endMessage,
          ended: 1
        })
        .where({ watchId })
    );
  }

  public remove(watchId: number): PromiseLike<boolean> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .delete()
        .where({ watchId })
    );
  }
}
