import { Location } from "@alehuo/clubhouse-shared";
import moment from "moment";
import knex from "../Database";
import { dtFormat } from "../utils/DtFormat";
import Dao from "./Dao";

const TABLE_NAME = "locations";

class LocationDao implements Dao<Location> {
  public findAll(): PromiseLike<Location[]> {
    return Promise.resolve(knex(TABLE_NAME).select());
  }

  public findOne(locationId: number): PromiseLike<Location> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .select()
        .where({ locationId })
        .first()
    );
  }

  public findByName(name: string): PromiseLike<Location> {
    return Promise.resolve(
      knex(TABLE_NAME)
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
    return Promise.resolve(knex(TABLE_NAME).insert(location));
  }

  public remove(locationId: number): PromiseLike<number> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .delete()
        .where({ locationId })
    );
  }
}

export default new LocationDao();
