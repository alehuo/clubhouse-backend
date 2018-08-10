import * as jwt from "jsonwebtoken";

/**
 * Signs and returns a JWT.
 * @param data Data.
 */
export const SignToken: (data: string | object | Buffer) => string = (
  data: string | object | Buffer
): string =>
  jwt.sign({ expiresIn: "1 day", data }, process.env.JWT_SECRET, {
    algorithm: "HS256"
  });
/**
 * Verifies the JWT.
 * @param token Decoded JWT.
 */
export const VerifyToken: (
  token: string,
  secret: string | Buffer
) => string | object = (
  token: string,
  secret: string | Buffer = process.env.JWT_SECRET
): string | object => {
  try {
    return jwt.verify(token, secret);
  } catch (ex) {
    throw new Error(ex);
  }
};
