import { Location } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import moment from "moment";
import { dtFormat } from "../utils/DtFormat";
import Dao from "./Dao";

const TABLE_NAME = "locations";

export default class LocationDao implements Dao<Location> {
  constructor(private readonly knex: Knex) {}

  public findAll(): PromiseLike<Location[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }

  public findOne(locationId: number): PromiseLike<Location> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ locationId })
        .first()
    );
  }

  public findByName(name: string): PromiseLike<Location> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ name })
        .first()
    );
  }

  public save(location: Location): PromiseLike<number[]> {
    if (location.locationId) {
      delete location.locationId;
    }
    location.created_at = moment().format(dtFormat);
    location.updated_at = moment().format(dtFormat);
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
