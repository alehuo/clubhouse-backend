import * as Promise from "bluebird";
import * as Knex from "knex";
import IStudentUnion from "../models/IStudentUnion";
import IDao from "./Dao";

const TABLE_NAME = "studentUnions";

export default class StudentUnionDao implements IDao<IStudentUnion> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<IStudentUnion[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }
  public findOne(unionId: number): Promise<IStudentUnion> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ unionId })
        .first()
    );
  }
  public findByName(name: string): Promise<IStudentUnion> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ name })
        .first()
    );
  }

  public save(stdu: IStudentUnion): Promise<number[]> {
    return Promise.resolve(this.knex(TABLE_NAME).insert(stdu));
  }

  public remove(id: number): Promise<boolean> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .delete()
        .where({ unionId: id })
    );
  }
}
