import IPermission from "./models/IPermission";
import PermissionDao from "./dao/PermissionDao";
import * as Knex from "knex";
import * as Database from "./Database";

// Knex instance
const knex: Knex = Database.connect();

const permissionDao: PermissionDao = new PermissionDao(knex);

export const permissionNames = {
  BAN_USER: "BAN_USER",
  EDIT_USER_ROLE: "EDIT_USER_ROLE",
  MAKE_USER_ADMIN: "MAKE_USER_ADMIN",
  ALLOW_USER_LOGIN: "ALLOW_USER_LOGIN",
  ADD_KEY_TO_USER: "ADD_KEY_TO_USER",
  REMOVE_KEY_FROM_USER: "REMOVE_KEY_FROM_USER",
  CHANGE_KEY_TYPE_OF_USER: "CHANGE_KEY_TYPE_OF_USER",
  ALLOW_VIEW_KEYS: "ALLOW_VIEW_KEYS",
  ADD_USER_TO_UNION: "ADD_USER_TO_UNION",
  REMOVE_USER_FROM_UNION: "REMOVE_USER_FROM_UNION",
  ADD_STUDENT_UNION: "ADD_STUDENT_UNION",
  REMOVE_STUDENT_UNION: "REMOVE_STUDENT_UNION",
  EDIT_STUDENT_UNION: "EDIT_STUDENT_UNION",
  ALLOW_VIEW_STUDENT_UNIONS: "ALLOW_VIEW_STUDENT_UNIONS",
  ADD_EVENT: "ADD_EVENT",
  EDIT_EVENT: "EDIT_EVENT",
  REMOVE_EVENT: "REMOVE_EVENT",
  ALLOW_VIEW_EVENTS: "ALLOW_VIEW_EVENTS",
  EDIT_RULES: "EDIT_RULES",
  ALLOW_VIEW_RULES: "ALLOW_VIEW_RULES",
  ADD_POSTS: "ADD_POSTS",
  EDIT_AND_REMOVE_OWN_POSTS: "EDIT_AND_REMOVE_OWN_POSTS",
  REMOVE_POSTS: "REMOVE_POSTS",
  ALLOW_VIEW_POSTS: "ALLOW_VIEW_POSTS",
  EDIT_OTHERS_POSTS: "EDIT_OTHERS_POSTS",
  SEND_MAILS: "SEND_MAILS",
  ADD_LOCATION: "ADD_LOCATION"
};

export const getPermission = async (permissionName: string): IPermission => {
  const perm: IPermission[] = await permissionDao.findByName(permissionName);
  if (perm && perm.length > 0) {
    return perm[0];
  } else {
    return null;
  }
};

/**
 * Calculates user's permissions using bitwise operations.
 * @param perms User permissions.
 */
export const calculatePermissions = (perms: IPermission[]): number =>
  perms.reduce((prev, curr) => prev | curr.value, perms[0].value);

/**
 * Returns the user's permissions.
 * @param userPerms User permission number.
 */
export const getPermissions = async (userPerms: number): Promise<string[]> => {
  const allowed = [];
  const allPerms: IPermission[] = await permissionDao.findAll();
  allPerms.map((k: IPermission) => {
    const permissionName: string = k.name;
    const permissionValue: number = k.value;
    if ((userPerms & permissionValue) === permissionValue) {
      allowed.push(permissionName);
    }
  });
  return allowed;
};

/**
 * Returns if the user has the required permissions or not.
 * @param userPerms User permissions
 * @param requiredPermissions Required permissions
 */
export const hasPermissions = (
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
