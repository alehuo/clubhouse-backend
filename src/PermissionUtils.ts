import IPermission from "./models/IPermission";

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

const permissions: IPermission[] = [
  {
    name: permissionNames.BAN_USER,
    value: 0x00000001
  },
  {
    name: permissionNames.EDIT_USER_ROLE,
    value: 0x00000002
  },
  {
    name: permissionNames.MAKE_USER_ADMIN,
    value: 0x00000004
  },
  {
    name: permissionNames.ALLOW_USER_LOGIN,
    value: 0x00000008
  },
  {
    name: permissionNames.ADD_KEY_TO_USER,
    value: 0x00000010
  },
  {
    name: permissionNames.REMOVE_KEY_FROM_USER,
    value: 0x00000020
  },
  {
    name: permissionNames.CHANGE_KEY_TYPE_OF_USER,
    value: 0x00000040
  },
  {
    name: permissionNames.ALLOW_VIEW_KEYS,
    value: 0x00000080
  },
  {
    name: permissionNames.ADD_USER_TO_UNION,
    value: 0x00000100
  },
  {
    name: permissionNames.REMOVE_USER_FROM_UNION,
    value: 0x00000200
  },
  {
    name: permissionNames.ADD_STUDENT_UNION,
    value: 0x00000400
  },
  {
    name: permissionNames.REMOVE_STUDENT_UNION,
    value: 0x00000800
  },
  {
    name: permissionNames.EDIT_STUDENT_UNION,
    value: 0x00001000
  },
  {
    name: permissionNames.ALLOW_VIEW_STUDENT_UNIONS,
    value: 0x00002000
  },
  {
    name: permissionNames.ADD_EVENT,
    value: 0x00004000
  },
  {
    name: permissionNames.EDIT_EVENT,
    value: 0x00008000
  },
  {
    name: permissionNames.REMOVE_EVENT,
    value: 0x00010000
  },
  {
    name: permissionNames.ALLOW_VIEW_EVENTS,
    value: 0x00020000
  },
  {
    name: permissionNames.EDIT_RULES,
    value: 0x00040000
  },
  {
    name: permissionNames.ALLOW_VIEW_RULES,
    value: 0x00080000
  },
  {
    name: permissionNames.ADD_POSTS,
    value: 0x00100000
  },
  {
    name: permissionNames.EDIT_AND_REMOVE_OWN_POSTS,
    value: 0x00200000
  },
  {
    name: permissionNames.REMOVE_POSTS,
    value: 0x00400000
  },
  {
    name: permissionNames.ALLOW_VIEW_POSTS,
    value: 0x00800000
  },
  {
    name: permissionNames.EDIT_OTHERS_POSTS,
    value: 0x01000000
  },
  {
    name: permissionNames.SEND_MAILS,
    value: 0x02000000
  },
  {
    name: permissionNames.ADD_LOCATION,
    value: 0x04000000
  }
];

export const getPermission = (permissionName: string): IPermission =>
  permissions.find(permission => permission.name === permissionName);

/**
 * Calculates user's permissions using bitwise operations.
 * @param perms User permissions.
 */
export const calculatePermissions = (perms: IPermission[]): number =>
  perms.reduce((prev, curr) => prev | curr.value, perms[0].value);

export const adminPermissions: number = calculatePermissions(permissions);

/**
 * Returns the user's permissions.
 * @param userPerms User permission number.
 */
export const getPermissions = (userPerms: number): string[] => {
  const allowed = [];
  permissions.map((k: IPermission) => {
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
