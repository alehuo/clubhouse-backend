import { DbUser } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import Dao from "./Dao";

const TABLE_NAME: string = "users";

export default class UserDao implements Dao<DbUser> {
  constructor(private readonly knex: Knex) {}

  public findAll(): PromiseLike<DbUser[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }
  public findOne(userId: number): PromiseLike<DbUser> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ userId })
        .first()
    );
  }
  public findByEmail(email: string): PromiseLike<DbUser> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ email })
        .first()
    );
  }

  public save(user: DbUser): PromiseLike<number[]> {
    return Promise.resolve(this.knex(TABLE_NAME).insert(user));
  }

  public update(user: DbUser): PromiseLike<boolean> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .where({ userId: user.userId })
        .update(user)
    );
  }

  public remove(userId: number): PromiseLike<boolean> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .delete()
        .where({ userId })
    );
  }
}
