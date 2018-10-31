import Knex from "knex";
import { IPermission } from "../models/IPermission";
import IDao from "./Dao";

const TABLE_NAME: string = "permissions";

export default class PermissionDao implements IDao<IPermission> {
  constructor(private readonly knex: Knex) {}

  public findAll(): PromiseLike<IPermission[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }

  public findOne(permissionId: number): PromiseLike<IPermission> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ permissionId })
        .first()
    );
  }

  public findByValue(value: number): PromiseLike<IPermission> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ value })
        .first()
    );
  }

  public findByName(name: string): PromiseLike<IPermission> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ name })
        .first()
    );
  }

  public save(permissions: IPermission): PromiseLike<number[]> {
    return Promise.resolve(this.knex(TABLE_NAME).insert(permissions));
  }

  public remove(permissionId: number): PromiseLike<boolean> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .delete()
        .where({ permissionId })
    );
  }
}
