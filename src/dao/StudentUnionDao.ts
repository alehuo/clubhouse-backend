import Knex from "knex";
import { IStudentUnion } from "../models/IStudentUnion";
import IDao from "./Dao";

const TABLE_NAME: string = "studentUnions";

export default class StudentUnionDao implements IDao<IStudentUnion> {
  constructor(private readonly knex: Knex) {}

  public findAll(): PromiseLike<IStudentUnion[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }
  public findOne(unionId: number): PromiseLike<IStudentUnion> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ unionId })
        .first()
    );
  }
  public findByName(name: string): PromiseLike<IStudentUnion> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ name })
        .first()
    );
  }

  public save(stdu: IStudentUnion): PromiseLike<number[]> {
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
