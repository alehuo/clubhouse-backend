import IDao from "./Dao";
import IPermission from "../models/IPermission";
import * as Promise from "bluebird";
import * as Knex from "knex";

export default class PermissionDao implements IDao<IPermission> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<IPermission[]> {
    return this.knex("permissions").select();
  }

  public findOne(permissionId: number): Promise<IPermission[]> {
    return this.knex("permissions")
      .select()
      .where({ permissionId });
  }

  public findByValue(value: number): Promise<IPermission[]> {
    return this.knex("permissions")
      .select()
      .where({ value });
  }

  public findByName(name: string): Promise<IPermission[]> {
    return this.knex("permissions")
      .select()
      .where({ name });
  }

  public save(permissions: IPermission): Promise<number[]> {
    return this.knex("permissions").insert(permissions);
  }

  public remove(permissionId: number): Promise<void> {
    return this.knex("permissions")
      .delete()
      .where({ permissionId });
  }
}
