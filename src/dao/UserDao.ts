import IDao from "./Dao";
import IUser from "../models/IUser";
import * as Promise from "bluebird";
import * as Knex from "knex";

export default class UserDao implements IDao<IUser> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<IUser[]> {
    return this.knex("users").select();
  }
  public findOne(id: number): Promise<IUser[]> {
    return this.knex("users")
      .select()
      .where({ imageId: id });
  }
  public findByUsername(username: string): Promise<IUser[]> {
    return this.knex("users")
      .select()
      .where({ username });
  }

  public save(user: IUser): Promise<IUser> {
    return this.knex("users").insert(user);
  }

  public remove(id: number): Promise<void> {
    return this.knex("users")
      .delete()
      .where({ imageId: id });
  }
}
