import IDao from "./Dao";
import IPermission from "../models/IPermission";
import * as Promise from "bluebird";
import * as Knex from "knex";

export default class PermissionDao implements IDao<IPermission> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<IPermission[]> {
    return this.knex("rolePermissions").select();
  }

  public findOne(rolePermissionId: number): Promise<IPermission[]> {
    return this.knex("rolePermissions")
      .select()
      .where({ rolePermissionId });
  }

  public findByRoleId(roleId: number): Promise<IPermission[]> {
    return this.knex("rolePermissions")
      .select()
      .where({ roleId });
  }

  public findPermissionsByUser(username: string): Promise<IPermission[]> {
    return this.knex("rolePermissions")
      .select()
      .innerJoin("users", "users.roleId", "rolePermissions.roleId")
      .where("users.username", username);
  }

  public findPermissionsByUserId(userId: number): Promise<IPermission[]> {
    return this.knex("rolePermissions")
      .select()
      .innerJoin("users", "users.roleId", "rolePermissions.roleId")
      .where("users.userId", userId);
  }

  public save(rolePermissions: any): Promise<IPermission> {
    return this.knex("rolePermissions").insert(rolePermissions);
  }

  public remove(rolePermissionId: number): Promise<void> {
    return this.knex("rolePermissions")
      .delete()
      .where({ rolePermissionId });
  }
}
