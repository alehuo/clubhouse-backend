export interface IUser {
  userId?: number;
  email: string;
  firstName: string;
  lastName: string;
  unionId: number;
  password: string;
  hidden?: boolean;
  permissions?: number;
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Filters an user object and removes its "hidden" & "password" fields.
 * @param user User object
 */
export const userFilter: (user: IUser) => object = (user: IUser): object => {
  return {
    userId: user.userId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    unionId: user.unionId,
    permissions: user.permissions,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
};
