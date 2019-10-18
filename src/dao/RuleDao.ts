import { Rule } from "@alehuo/clubhouse-shared";
import knex from "../Database";
import moment from "moment";
import { dtFormat } from "../utils/DtFormat";
import Dao from "./Dao";

const table = "rules";

class RuleDao implements Dao<Rule> {
  public findAll(): PromiseLike<Rule[]> {
    return Promise.resolve(knex(table).select());
  }
  public findOne(id: number): PromiseLike<Rule> {
    return Promise.resolve(
      knex(table)
        .select()
        .where({ ruleId: id })
        .first()
    );
  }
  public remove(id: number): PromiseLike<number> {
    throw new Error("Method not implemented.");
  }
  public save(entity: Rule): PromiseLike<number[]> {
    if (entity.ruleId) {
      delete entity.ruleId;
    }
    entity.created_at = moment().format(dtFormat);
    entity.updated_at = moment().format(dtFormat);
    return Promise.resolve(knex(table).insert(entity));
  }
}

export default new RuleDao();
