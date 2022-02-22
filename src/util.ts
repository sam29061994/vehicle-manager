import jwt from "jsonwebtoken";
import config from "config";


const privateKey = config.get("privateKey") as string;

export const signJWT = (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, privateKey, options);
};

export function decodeJWT(token: string) {
  try {
    const user = jwt.verify(token, privateKey);

    return { valid: true, expired: false, user };
  } catch (error) {
    return {
      valid: false,
      expired: (error as Error).message === "jwt expired",
      user: null,
    };
  }
}
