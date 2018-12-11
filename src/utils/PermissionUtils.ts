import { Permission } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import PermissionDao from "../dao/PermissionDao";
import * as Database from "../Database";

// Knex instance
const knex: Knex = Database.connect();

const permissionDao: PermissionDao = new PermissionDao(knex);

export const getPermission: (
  permissionName: string
) => Promise<Permission> = async (
  permissionName: string
): Promise<Permission> => permissionDao.findByName(permissionName);

/**
 * Calculates user's permissions using bitwise operations.
 * @param perms User permissions.
 */
export const calculatePermissions: (perms: Permission[]) => number = (
  perms: Permission[]
): number =>
  perms.reduce(
    (prev: number, curr: Permission) => prev | curr.value,
    perms[0].value
  );

/**
 * Returns the user's permissions.
 * @param userPerms User permission number.
 */
export const getPermissions: (
  userPerms: number
) => Promise<Permission[]> = async (
  userPerms: number
): Promise<Permission[]> => {
  const allowed: Permission[] = [];
  const allPerms = await permissionDao.findAll();
  allPerms.map((k) => {
    const permissionValue = k.value;
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
  userPerms: number | Permission[],
  requiredPermissions: number | Permission[]
) => boolean = (
  userPerms: number | Permission[],
  requiredPermissions: number | Permission[]
): boolean => {
  if (typeof userPerms === "number") {
    if (typeof requiredPermissions === "number") {
      return (requiredPermissions & userPerms) === requiredPermissions;
    } else {
      const requiredPerms = calculatePermissions(requiredPermissions);
      return (requiredPerms & userPerms) === requiredPerms;
    }
  } else {
    if (typeof requiredPermissions === "number") {
      return (
        (requiredPermissions & calculatePermissions(userPerms)) ===
        requiredPermissions
      );
    } else {
      const requiredPerms = calculatePermissions(requiredPermissions);
      return (
        (requiredPerms & calculatePermissions(userPerms)) === requiredPerms
      );
    }
  }
};
