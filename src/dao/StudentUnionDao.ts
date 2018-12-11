import { StudentUnion } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import Dao from "./Dao";

const TABLE_NAME: string = "studentUnions";

export default class StudentUnionDao implements Dao<StudentUnion> {
  constructor(private readonly knex: Knex) {}

  public findAll(): PromiseLike<StudentUnion[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }
  public findOne(unionId: number): PromiseLike<StudentUnion> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ unionId })
        .first()
    );
  }
  public findByName(name: string): PromiseLike<StudentUnion> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ name })
        .first()
    );
  }

  public save(stdu: StudentUnion): PromiseLike<number[]> {
    return Promise.resolve(this.knex(TABLE_NAME).insert(stdu));
  }

  public remove(id: number): PromiseLike<boolean> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .delete()
        .where({ unionId: id })
    );
  }
}
