import { Key } from "@alehuo/clubhouse-shared";
import knex from "../Database";
import moment from "moment";
import { dtFormat } from "../utils/DtFormat";
import Dao from "./Dao";

const TABLE_NAME = "keys";

class KeyDao implements Dao<Key> {
  public findAll(): PromiseLike<Key[]> {
    return Promise.resolve(knex(TABLE_NAME).select());
  }
  public findOne(id: number): PromiseLike<Key> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .select()
        .where({ keyId: id })
        .first()
    );
  }
  public findByKeyType(keyTypeId: number): PromiseLike<Key[]> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .select()
        .where({ keyTypeId })
    );
  }
  public findByUser(userId: number): PromiseLike<Key[]> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .select()
        .where({ userId })
    );
  }
  public remove(id: number): PromiseLike<number> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .delete()
        .where({ keyId: id })
    );
  }
  public update(entity: Key): PromiseLike<number> {
    const id = entity.keyId;
    delete entity.keyId;
    entity.updated_at = moment().format(dtFormat);
    return Promise.resolve(
      knex(TABLE_NAME)
        .update(entity)
        .where({ keyId: id })
    );
  }
  public save(entity: Key): PromiseLike<number[]> {
    delete entity.keyId;
    entity.created_at = moment().format(dtFormat);
    entity.updated_at = moment().format(dtFormat);
    return Promise.resolve(knex(TABLE_NAME).insert(entity));
  }
}

export default new KeyDao();
