import * as Promise from "bluebird";
import * as Knex from "knex";
import { IUser } from "../models/IUser";
import IDao from "./Dao";

const TABLE_NAME: string = "users";

export default class UserDao implements IDao<IUser> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<IUser[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }
  public findOne(userId: number): Promise<IUser> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ userId })
        .first()
    );
  }
  public findByEmail(email: string): Promise<IUser> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ email })
        .first()
    );
  }

  public save(user: IUser): Promise<number[]> {
    return Promise.resolve(this.knex(TABLE_NAME).insert(user));
  }

  public update(user: IUser): Promise<boolean> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .where({ userId: user.userId })
        .update(user)
    );
  }

  public remove(userId: number): Promise<boolean> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .delete()
        .where({ userId })
    );
  }
}
