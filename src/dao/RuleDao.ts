import { Rule } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import Dao from "./Dao";

const table = "rules";

export default class RuleDao implements Dao<Rule> {
  constructor(private readonly knex: Knex) {}
  public findAll(): PromiseLike<Rule[]> {
    return Promise.resolve(this.knex(table).select());
  }
  public findOne(id: number): PromiseLike<Rule> {
    throw new Error("Method not implemented.");
  }
  public remove(id: number): PromiseLike<boolean> {
    throw new Error("Method not implemented.");
  }
  public save(entity: Rule): PromiseLike<number[]> {
    throw new Error("Method not implemented.");
  }
}
