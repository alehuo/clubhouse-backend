import { KeyType } from "@alehuo/clubhouse-shared";
import knex from "../Database";
import moment from "moment";
import { dtFormat } from "../utils/DtFormat";
import Dao from "./Dao";

const TABLE_NAME = "keyTypes";

class KeyTypeDao implements Dao<KeyType> {
  public findAll(): PromiseLike<KeyType[]> {
    return Promise.resolve(knex(TABLE_NAME).select());
  }
  public findOne(id: number): PromiseLike<KeyType> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .select()
        .where({ keyTypeId: id })
        .first()
    );
  }
  public remove(id: number): PromiseLike<number> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .delete()
        .where({ keyTypeId: id })
    );
  }
  public update(entity: KeyType): PromiseLike<number> {
    const id = entity.keyTypeId;
    delete entity.keyTypeId;
    entity.updated_at = moment().format(dtFormat);
    return Promise.resolve(
      knex(TABLE_NAME)
        .update(entity)
        .where({ keyTypeId: id })
    );
  }
  public save(entity: KeyType): PromiseLike<number[]> {
    delete entity.keyTypeId;
    entity.created_at = moment().format(dtFormat);
    entity.updated_at = moment().format(dtFormat);
    return Promise.resolve(knex(TABLE_NAME).insert(entity));
  }
}

export default new KeyTypeDao()