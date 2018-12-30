import { Key } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import moment from "moment";
import Dao from "./Dao";
import { dtFormat } from "../index";

const TABLE_NAME = "keys";

export default class KeyDao implements Dao<Key> {
  constructor(private readonly knex: Knex) {}

  public findAll(): PromiseLike<Key[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }
  public findOne(id: number): PromiseLike<Key> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ keyId: id })
        .first()
    );
  }
  public findByKeyType(keyTypeId: number): PromiseLike<Key[]> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ keyTypeId })
    );
  }
  public findByUser(userId: number): PromiseLike<Key[]> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ userId })
    );
  }
  public remove(id: number): PromiseLike<boolean> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .delete()
        .where({ keyId: id })
    );
  }
  public update(entity: Key): PromiseLike<number[]> {
    const id = entity.keyId;
    delete entity.keyId;
    entity.updated_at = moment().format(dtFormat);
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .update(entity)
        .where({ keyId: id })
    );
  }
  public save(entity: Key): PromiseLike<number[]> {
    delete entity.keyId;
    entity.created_at = moment().format(dtFormat);
    entity.updated_at = moment().format(dtFormat);
    return Promise.resolve(this.knex(TABLE_NAME).insert(entity));
  }
}
