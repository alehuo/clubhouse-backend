import { DbUser, User } from "@alehuo/clubhouse-shared";

/**
 * Filters an user object and removes its "hidden" & "password" fields.
 * @param user User object
 */
export const userFilter: (user: DbUser) => User = (user: DbUser): User => {
  return {
    userId: user.userId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    permissions: user.permissions,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
};
