import { Permission } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import { addTimestamps } from "../utils/TimestampGenerator";
import Dao from "./Dao";

const TABLE_NAME: string = "permissions";

export default class PermissionDao implements Dao<Permission> {
  constructor(private readonly knex: Knex) {}

  public findAll(): PromiseLike<Permission[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }

  public findOne(permissionId: number): PromiseLike<Permission> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ permissionId })
        .first()
    );
  }

  public findByValue(value: number): PromiseLike<Permission> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ value })
        .first()
    );
  }

  public findByName(name: string): PromiseLike<Permission> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ name })
        .first()
    );
  }

  public save(permissions: Permission): PromiseLike<number[]> {
    if (permissions.permissionId) {
      delete permissions.permissionId;
    }
    addTimestamps(permissions);
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
