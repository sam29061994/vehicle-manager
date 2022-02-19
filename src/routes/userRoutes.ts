import express from "express";
import * as userController from "../controller/user.controller";
import * as authController from "../controller/auth.controller";
import {
  createUserSchema,
  createUserSessionSchema,
} from "../schemas/user.schema";
import { validate, requiresUser } from "../middleware";

const router = express.Router();

router.post(
  "/signup",
  validate(createUserSchema),
  userController.createUserHandler
);

router.post(
  "/signin",
  validate(createUserSessionSchema),
  authController.createUserSessionHandler
);

router.post(
  "/signout",
  requiresUser,
  authController.invalidateUserSessionHandler
);

router.get("/sessions", requiresUser, authController.getUserSessionsHandler);

router.get("/", userController.getUsers);

router
  .route("/:id")
  .get(userController.findUserHandler)
  .delete(userController.deleteUserHandler);

export default router;
