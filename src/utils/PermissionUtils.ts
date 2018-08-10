import * as Knex from "knex";
import PermissionDao from "./../dao/PermissionDao";
import * as Database from "./../Database";
import IPermission from "./../models/IPermission";

// Knex instance
const knex: Knex = Database.connect();

const permissionDao: PermissionDao = new PermissionDao(knex);

export const getPermission: (
  permissionName: string
) => Promise<IPermission> = async (
  permissionName: string
): Promise<IPermission> => permissionDao.findByName(permissionName);

/**
 * Calculates user's permissions using bitwise operations.
 * @param perms User permissions.
 */
export const calculatePermissions: (perms: IPermission[]) => number = (
  perms: IPermission[]
): number =>
  perms.reduce(
    (prev: number, curr: IPermission) => prev | curr.value,
    perms[0].value
  );

/**
 * Returns the user's permissions.
 * @param userPerms User permission number.
 */
export const getPermissions: (
  userPerms: number
) => Promise<IPermission[]> = async (
  userPerms: number
): Promise<IPermission[]> => {
  const allowed: IPermission[] = [];
  const allPerms: IPermission[] = await permissionDao.findAll();
  allPerms.map((k: IPermission) => {
    const permissionName: string = k.name;
    const permissionValue: number = k.value;
    if ((userPerms & permissionValue) === permissionValue) {
      allowed.push(k);
    }
  });
  return allowed;
};

/**
 * Returns if the user has the required permissions or not.
 * @param userPerms User permissions
 * @param requiredPermissions Required permissions
 */
export const hasPermissions: (
  userPerms: number | IPermission[],
  requiredPermissions: number | IPermission[]
) => boolean = (
  userPerms: number | IPermission[],
  requiredPermissions: number | IPermission[]
): boolean => {
  if (typeof userPerms === "number") {
    if (typeof requiredPermissions === "number") {
      return (requiredPermissions & userPerms) === requiredPermissions;
    } else {
      const requiredPerms: number = calculatePermissions(requiredPermissions);
      return (requiredPerms & userPerms) === requiredPerms;
    }
  } else {
    if (typeof requiredPermissions === "number") {
      return (
        (requiredPermissions & calculatePermissions(userPerms)) ===
        requiredPermissions
      );
    } else {
      const requiredPerms: number = calculatePermissions(requiredPermissions);
      return (
        (requiredPerms & calculatePermissions(userPerms)) === requiredPerms
      );
    }
  }
};
