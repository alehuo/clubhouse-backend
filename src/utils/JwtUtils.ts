import jwt from "jsonwebtoken";

/**
 * Signs and returns a JWT.
 * @param data Data.
 */
export const SignToken: (data: string | object | Buffer) => string = (
  data: string | object | Buffer
): string => {
  if (process.env.JWT_SECRET !== undefined) {
    return jwt.sign({ expiresIn: "1 day", data }, String(process.env.JWT_SECRET), {
      algorithm: "HS256"
    });
  }
  throw new Error("JWT_SECRET is undefined");
};
/**
 * Verifies the JWT.
 * @param token Decoded JWT.
 */
export const VerifyToken: (
  token: string,
  secret?: string | Buffer
) => string | object = (
  token: string,
  secret: string | undefined = process.env.JWT_SECRET
): string | object => {
  try {
    if (secret !== undefined) {
      return jwt.verify(token, String(secret));
    }
    throw new Error("JWT_SECRET is undefined");
  } catch (ex) {
    throw new Error(ex);
  }
};
