import * as Promise from "bluebird";
import * as Knex from "knex";
import { IPermission } from "../models/IPermission";
import IDao from "./Dao";

const TABLE_NAME: string = "permissions";

export default class PermissionDao implements IDao<IPermission> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<IPermission[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }

  public findOne(permissionId: number): Promise<IPermission> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ permissionId })
        .first()
    );
  }

  public findByValue(value: number): Promise<IPermission> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ value })
        .first()
    );
  }

  public findByName(name: string): Promise<IPermission> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ name })
        .first()
    );
  }

  public save(permissions: IPermission): Promise<number[]> {
    return Promise.resolve(this.knex(TABLE_NAME).insert(permissions));
  }

  public remove(permissionId: number): Promise<boolean> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .delete()
        .where({ permissionId })
    );
  }
}
