import { DbUser } from "@alehuo/clubhouse-shared";
import knex from "../Database";
import moment from "moment";
import { dtFormat } from "../utils/DtFormat";
import Dao from "./Dao";

const TABLE_NAME = "users";

class UserDao implements Dao<DbUser> {
  public findAll() {
    return Promise.resolve(knex(TABLE_NAME).select<DbUser[]>());
  }
  public findOne(userId: number): PromiseLike<DbUser> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .select()
        .where({ userId })
        .first()
    );
  }
  public findByEmail(email: string): PromiseLike<DbUser> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .select()
        .where({ email })
        .first()
    );
  }

  public save(user: DbUser): PromiseLike<number[]> {
    if (user.userId) {
      delete user.userId;
    }
    user.created_at = moment().format(dtFormat);
    user.updated_at = moment().format(dtFormat);
    return Promise.resolve(knex(TABLE_NAME).insert(user));
  }

  public update(user: DbUser): PromiseLike<boolean> {
    const userId = user.userId;
    delete user.userId;
    user.updated_at = moment().format(dtFormat);
    return Promise.resolve(
      knex(TABLE_NAME)
        .where({ userId })
        .update(user)
    );
  }

  public remove(userId: number): Promise<number> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .delete()
        .where({ userId })
    );
  }
}

export default new UserDao();
