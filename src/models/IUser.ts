export default interface IUser {
  userId?: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  unionId: number;
  password: string;
  hidden?: boolean;
  permissions?: number;
  created_at?: Date;
  updated_at?: Date;
};

/**
 * Filters an user object and removes its "hidden" & "password" fields.
 * @param user User object
 */
export const userFilter = (user: IUser) => {
  return {
    userId: user.userId,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    unionId: user.unionId,
    permissions: user.permissions,
    created_at: user.created_at,
    updateD_at: user.updated_at
  };
};
