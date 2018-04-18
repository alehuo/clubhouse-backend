import IDao from "./Dao";
import IUser, { userFilter } from "../models/IUser";
import Promise from "bluebird";
import * as Knex from "knex";

const TABLE_NAME = "users";

export default class UserDao implements IDao<IUser> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<IUser[]> {
    return this.knex(TABLE_NAME).select();
  }
  public findOne(userId: number): Promise<IUser[]> {
    return this.knex(TABLE_NAME)
      .select()
      .where({ userId });
  }
  public findByUsername(username: string): Promise<IUser[]> {
    return this.knex(TABLE_NAME)
      .select()
      .where({ username });
  }

  public save(user: IUser): Promise<number[]> {
    return this.knex(TABLE_NAME).insert(user);
  }

  public remove(id: number): Promise<void> {
    return this.knex(TABLE_NAME)
      .delete()
      .where({ imageId: id });
  }
}
