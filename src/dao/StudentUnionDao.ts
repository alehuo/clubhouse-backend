import { StudentUnion } from "@alehuo/clubhouse-shared";
import knex from "../Database";
import moment from "moment";
import { dtFormat } from "../utils/DtFormat";
import Dao from "./Dao";

const TABLE_NAME = "studentUnions";

class StudentUnionDao implements Dao<StudentUnion> {

  public findAll(): PromiseLike<StudentUnion[]> {
    return Promise.resolve(knex(TABLE_NAME).select());
  }
  public findOne(unionId: number): PromiseLike<StudentUnion> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .select()
        .where({ unionId })
        .first()
    );
  }
  public findByName(name: string): PromiseLike<StudentUnion> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .select()
        .where({ name })
        .first()
    );
  }

  public save(stdu: StudentUnion): PromiseLike<number[]> {
    if (stdu.unionId) {
      delete stdu.unionId;
    }
    stdu.created_at = moment().format(dtFormat);
    stdu.updated_at = moment().format(dtFormat);
    return Promise.resolve(knex(TABLE_NAME).insert(stdu));
  }

  public remove(id: number): PromiseLike<number> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .delete()
        .where({ unionId: id })
    );
  }
}

export default new StudentUnionDao();
