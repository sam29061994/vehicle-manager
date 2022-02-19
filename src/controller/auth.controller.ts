import { Request, Response, NextFunction } from "express";
import { signJWT } from "../util";
import config from "config";
import {
  reIssueAccessToken,
  createSession,
  createAccessToken,
  deleteSession,
  findSessions,
} from "../service/auth.service";
import { validatePassword, findUser } from "../service/user.service";

export const createUserSessionHandler = async (req: Request, res: Response) => {
  // validate the email and password
  const isValid = await validatePassword(req.body);
  const { email } = req.body;
  const user = await findUser({ email });

  if (!user || !isValid) {
    return res.status(401).send("Invalid username or password");
  }

  // Create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  // create access token
  const accessToken = createAccessToken({
    user,
    session,
  });

  // create refresh token
  const refreshToken = signJWT(session, {
    expiresIn: config.get("refreshTokenTtl"), // 1 year
  });

  // send refresh & access token back
  return res.status(200).send({
    status: "success",
    data: {
      accessToken,
      refreshToken,
    },
  });
};

export const invalidateUserSessionHandler = async (
  req: Request,
  res: Response
) => {
  console.log("req", req);
  const sessionId = (req as any).user.session;

  await deleteSession({ _id: sessionId });

  return res.status(200).send({
    status: "success",
  });
};

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = (req as any).user._id;
  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}
