import * as Promise from "bluebird";
import * as Knex from "knex";
import ILocation from "../models/ILocation";
import IDao from "./Dao";

const TABLE_NAME = "locations";

export default class LocationDao implements IDao<ILocation> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<ILocation[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }

  public findOne(locationId: number): Promise<ILocation> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ locationId })
        .first()
    );
  }

  public findByName(name: string): Promise<ILocation> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ name })
        .first()
    );
  }

  public save(location: ILocation): Promise<number[]> {
    return Promise.resolve(this.knex(TABLE_NAME).insert(location));
  }

  public remove(locationId: number): Promise<boolean> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .delete()
        .where({ locationId })
    );
  }
}
