import * as Promise from "bluebird";
import * as Knex from "knex";
import IUser, { userFilter } from "../models/IUser";
import IDao from "./Dao";

const TABLE_NAME = "users";

export default class UserDao implements IDao<IUser> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<IUser[]> {
    return this.knex(TABLE_NAME).select();
  }
  public findOne(userId: number): Promise<IUser> {
    return this.knex(TABLE_NAME)
      .select()
      .where({ userId })
      .first();
  }
  public findByEmail(email: string): Promise<IUser> {
    return this.knex(TABLE_NAME)
      .select()
      .where({ email })
      .first();
  }

  public save(user: IUser): Promise<number[]> {
    return this.knex(TABLE_NAME).insert(user);
  }

  public update(user: IUser): Promise<boolean> {
    return this.knex(TABLE_NAME)
      .where({ userId: user.userId })
      .update(user);
  }

  public remove(userId: number): Promise<boolean> {
    return this.knex(TABLE_NAME)
      .delete()
      .where({ userId });
  }
}
