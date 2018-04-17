import IDao from "./Dao";
import Promise from "bluebird";
import * as Knex from "knex";
import IStudentUnion from "../models/IStudentUnion";

export default class StudentUnionDao implements IDao<IStudentUnion> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<IStudentUnion[]> {
    return this.knex("studentUnions").select();
  }
  public findOne(unionId: number): Promise<IStudentUnion[]> {
    return this.knex("studentUnions")
      .select()
      .where({ unionId });
  }
  public findByName(name: string): Promise<IStudentUnion[]> {
    return this.knex("studentUnions")
      .select()
      .where({ name });
  }

  public save(stdu: {
    name: string;
    description: string;
  }): Promise<number[]> {
    return this.knex("studentUnions").insert(stdu);
  }

  public remove(id: number): Promise<void> {
    return this.knex("studentUnions")
      .delete()
      .where({ unionId: id });
  }
}
