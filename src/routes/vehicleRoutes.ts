import express from "express";
import {
  createVehicleSchema,
  deleteVehicleSchema,
  updateVehicleSchema,
} from "../schemas/vehicle.schema";
import * as vehicleController from "../controller/vehicle.controller";
import { validate, requiresUser } from "../middleware";

const router = express.Router();

// Create a post
router
  .route("/")
  .get(requiresUser, vehicleController.getVehiclesForUserHandler)
  .post(
    [requiresUser, validate(createVehicleSchema)],
    vehicleController.createVehicleHandler
  );

// Get a post
router
  .route("/:id")
  .get(vehicleController.getVehicleHandler)
  .delete(
    [requiresUser, validate(deleteVehicleSchema)],
    vehicleController.deleteVehicleHandler
  )
  .put(
    [requiresUser, validate(updateVehicleSchema)],
    vehicleController.updateVehicleHandler
  );

export default router;
