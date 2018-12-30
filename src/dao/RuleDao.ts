import { Rule } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import moment from "moment";
import Dao from "./Dao";
import { dtFormat } from "../index";

const table = "rules";

export default class RuleDao implements Dao<Rule> {
  constructor(private readonly knex: Knex) {}
  public findAll(): PromiseLike<Rule[]> {
    return Promise.resolve(this.knex(table).select());
  }
  public findOne(id: number): PromiseLike<Rule> {
    return Promise.resolve(
      this.knex(table)
        .select()
        .where({ ruleId: id })
        .first()
    );
  }
  public remove(id: number): PromiseLike<boolean> {
    throw new Error("Method not implemented.");
  }
  public save(entity: Rule): PromiseLike<number[]> {
    const ruleId = entity.ruleId;
    delete entity.ruleId;
    entity.updated_at = moment().format(dtFormat);
    return Promise.resolve(
      this.knex(table)
        .update(entity)
        .where({ ruleId })
    );
  }
}
