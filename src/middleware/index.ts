import { AnySchema } from "yup";
import { decodeJWT } from "../util";
import { Request, Response, NextFunction } from "express";
import { reIssueAccessToken } from "../service/auth.service";
import log from "../logger";

export const validate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (e) {
      log.error((e as Error).message);
      return res.status(400).send(e);
    }
  };

export const requiresUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req as any;

  if (!user) {
    return res.sendStatus(403);
  }

  return next();
};

export const extractUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    req.headers?.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

  if (!accessToken) return next();

  const { user, expired } = decodeJWT(accessToken);
  console.log(user);

  if (user) {
    // @ts-ignore
    req.user = user;

    return next();
  }
  let refreshToken = "";

  if ("x-refresh" in req.headers) {
    refreshToken = req.headers["x-refresh"] as string;
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      // Add the new access token to the response header
      res.setHeader("x-access-token", newAccessToken);

      const { user } = decodeJWT(newAccessToken);

      // @ts-ignore
      req.user = user;
    }

    return next();
  }

  return next();
};
