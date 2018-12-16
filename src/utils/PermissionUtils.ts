import { Permission } from "@alehuo/clubhouse-shared";

/**
 * Calculates user's permissions using bitwise operations.
 * @param perms User permissions.
 */
export const calculatePermissions: (perms: number[]) => number = (
  perms: number[]
): number =>
  perms.reduce((prev: number, curr: number) => prev | curr, perms[0]);

/**
 * Returns the user's permissions.
 * @param userPerms User permission number.
 */
export const getPermissions = (userPerms: number): string[] => {
  const allowed: string[] = [];
  Object.keys(Permission).map((k) => {
    const permissionValue = Permission[k as keyof typeof Permission];
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
export const hasPermissions = (
  userPerms: number,
  requiredPermissions: number
): boolean => (requiredPermissions & userPerms) === requiredPermissions;
