import { AnySchema } from "yup";
import { decodeJWT } from "../util";
import config from "config";
import { Request, Response, NextFunction } from "express";
import { reIssueAccessToken } from "../service/auth.service";
import log from "../logger";

// Validate schema on upcoming request
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

// Give Cors access to given domains
export const alloweCredentials = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allowedOrigins = config.get("allowedOrigins") as string[];
  const origin = req.headers.origin as string;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
};

//Validate if user is accessible on given request
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

//Extract user and attach on req object
export const extractUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let accessToken =
    req.headers?.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;
  if (!accessToken) {
    accessToken = req.cookies.accessToken;
  }

  if (!accessToken) return next();

  const { user, expired } = decodeJWT(accessToken);

  if (user) {
    // @ts-ignore
    req.user = user;

    return next();
  }
  let refreshToken = "";

  if ("x-refresh" in req.headers) {
    refreshToken = req.headers["x-refresh"] as string;
  }
  if (!refreshToken) {
    refreshToken = req.cookies.refreshToken;
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
