export default interface IUser {
  userId: number;
  username: string;
  email: string;
  password: string;
  hidden: boolean;
}

/**
 * Filters an user object and removes its "hidden" & "password" fields.
 * @param user User object
 */
export const userFilter = (user: IUser) => {
  return {
    userId: user.userId,
    username: user.username,
    email: user.email
  };
};
