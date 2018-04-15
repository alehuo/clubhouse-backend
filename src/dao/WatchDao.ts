import IDao from "./Dao";
import Promise from "bluebird";
import * as Knex from "knex";
import IWatch from "../models/IWatch";

/**
 * DAO used to handle watches.
 */
export default class WatchDao implements IDao<IWatch> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<IWatch[]> {
    return this.knex("watches").select();
  }
  public findAllOngoing(): Promise<IWatch[]> {
    return this.knex("watches")
      .select()
      .where("endTime", "IS", null);
  }
  public findOne(watchId: number): Promise<IWatch[]> {
    return this.knex("watches")
      .select()
      .where({ watchId });
  }
  public findOngoingByUser(userId: number): Promise<IWatch[]> {
    return this.knex("watches")
      .select()
      .where({ userId })
      .andWhere("endTime", "IS", null);
  }
  public findByUser(userId: number): Promise<IWatch[]> {
    return this.knex("watches")
      .select()
      .where({ userId });
  }

  public save(watch: IWatch): Promise<IWatch> {
    return this.knex("watches").insert(watch);
  }

  public remove(watchId: number): Promise<void> {
    return this.knex("watches")
      .delete()
      .where({ watchId });
  }
}
