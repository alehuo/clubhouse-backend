import IDao from "./Dao";
import * as Promise from "bluebird";
import * as Knex from "knex";
import ILocation from "../models/ILocation";

export default class LocationDao implements IDao<ILocation> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<ILocation[]> {
    return this.knex("locations").select();
  }

  public findOne(locationId: number): Promise<ILocation[]> {
    return this.knex("locations")
      .select()
      .where({ locationId });
  }

  public findByName(name: string): Promise<ILocation[]> {
    return this.knex("locations")
      .select()
      .where({ name });
  }

  public save(location: ILocation): Promise<ILocation> {
    return this.knex("locations").insert(location);
  }

  public remove(locationId: number): Promise<void> {
    return this.knex("locations")
      .delete()
      .where({ locationId });
  }
}
