import { SignToken } from "../src/utils/JwtUtils";

export const generateToken: (userData?: any) => string = (
  userData?: any
): string => {
  if (userData) {
    return (
      "Bearer " +
      SignToken({
        ...{
          userId: 1,
          email: "testuser@email.com",
          firstName: "Test",
          lastName: "User",
          unionId: 1,
          permissions: 67108863
        },
        ...userData
      })
    );
  } else {
    return (
      "Bearer " +
      SignToken({
        userId: 1,
        email: "testuser@email.com",
        firstName: "Test",
        lastName: "User",
        unionId: 1,
        permissions: 67108863
      })
    );
  }
};
