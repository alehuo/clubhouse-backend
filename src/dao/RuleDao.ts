import { Rule } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import moment from "moment";
import { dtFormat } from "../utils/DtFormat";
import Dao from "./Dao";

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
    if (entity.ruleId) {
      delete entity.ruleId;
    }
    entity.created_at = moment().format(dtFormat);
    entity.updated_at = moment().format(dtFormat);
    return Promise.resolve(this.knex(table).insert(entity));
  }
}
