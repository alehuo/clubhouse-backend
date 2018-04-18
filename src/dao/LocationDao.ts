import IDao from "./Dao";
import Promise from "bluebird";
import * as Knex from "knex";
import ILocation from "../models/ILocation";

const TABLE_NAME = "locations";

export default class LocationDao implements IDao<ILocation> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<ILocation[]> {
    return this.knex(TABLE_NAME).select();
  }

  public findOne(locationId: number): Promise<ILocation[]> {
    return this.knex(TABLE_NAME)
      .select()
      .where({ locationId });
  }

  public findByName(name: string): Promise<ILocation[]> {
    return this.knex(TABLE_NAME)
      .select()
      .where({ name });
  }

  public save(location: ILocation): Promise<number[]> {
    return this.knex(TABLE_NAME).insert(location);
  }

  public remove(locationId: number): Promise<void> {
    return this.knex(TABLE_NAME)
      .delete()
      .where({ locationId });
  }
}
