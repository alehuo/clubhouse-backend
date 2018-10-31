import Knex from "knex";
import { ILocation } from "../models/ILocation";
import IDao from "./Dao";

const TABLE_NAME: string = "locations";

export default class LocationDao implements IDao<ILocation> {
  constructor(private readonly knex: Knex) {}

  public findAll(): PromiseLike<ILocation[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }

  public findOne(locationId: number): PromiseLike<ILocation> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ locationId })
        .first()
    );
  }

  public findByName(name: string): PromiseLike<ILocation> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ name })
        .first()
    );
  }

  public save(location: ILocation): PromiseLike<number[]> {
    return Promise.resolve(this.knex(TABLE_NAME).insert(location));
  }

  public remove(locationId: number): PromiseLike<boolean> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .delete()
        .where({ locationId })
    );
  }
}
