import { KeyType } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import moment from "moment";
import Dao from "./Dao";
import { dtFormat } from "../index";

const TABLE_NAME = "keyTypes";

export default class KeyTypeDao implements Dao<KeyType> {
  constructor(private readonly knex: Knex) {}

  public findAll(): PromiseLike<KeyType[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }
  public findOne(id: number): PromiseLike<KeyType> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ keyTypeId: id })
        .first()
    );
  }
  public remove(id: number): PromiseLike<boolean> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .delete()
        .where({ keyTypeId: id })
    );
  }
  public update(entity: KeyType): PromiseLike<number[]> {
    const id = entity.keyTypeId;
    delete entity.keyTypeId;
    entity.updated_at = moment().format(dtFormat);
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .update(entity)
        .where({ keyTypeId: id })
    );
  }
  public save(entity: KeyType): PromiseLike<number[]> {
    delete entity.keyTypeId;
    entity.created_at = moment().format(dtFormat);
    entity.updated_at = moment().format(dtFormat);
    return Promise.resolve(this.knex(TABLE_NAME).insert(entity));
  }
}
