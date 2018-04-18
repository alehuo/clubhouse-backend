import IDao from "./Dao";
import Promise from "bluebird";
import * as Knex from "knex";
import IStudentUnion from "../models/IStudentUnion";

const TABLE_NAME = "studentUnions";

export default class StudentUnionDao implements IDao<IStudentUnion> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<IStudentUnion[]> {
    return this.knex(TABLE_NAME).select();
  }
  public findOne(unionId: number): Promise<IStudentUnion[]> {
    return this.knex(TABLE_NAME)
      .select()
      .where({ unionId });
  }
  public findByName(name: string): Promise<IStudentUnion[]> {
    return this.knex(TABLE_NAME)
      .select()
      .where({ name });
  }

  public save(stdu: IStudentUnion): Promise<number[]> {
    return this.knex(TABLE_NAME).insert(stdu);
  }

  public remove(id: number): Promise<boolean> {
    return this.knex(TABLE_NAME)
      .delete()
      .where({ unionId: id });
  }
}
