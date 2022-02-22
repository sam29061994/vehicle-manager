import { Request, Response } from "express";
import { get } from "lodash";
import {
  createVehicle,
  findVehicle,
  findAndUpdateVehicle,
  deleteVehicle,
  findVehicles,
  findVehicleWithUser,
} from "../service/vehicle.service";

export const createVehicleHandler = async (req: Request, res: Response) => {
  const userId = get(req, "user._id");
  const vehicles = await findVehicles({ user: userId }, {});

  if (vehicles.length <= 2) {
    const body = req.body;

    const vehicle = await createVehicle({ ...body, user: userId });

    return res.status(200).json({
      status: "success",
      data: {
        vehicle,
      },
    });
  }
  return res.status(401).json({
    status: "error",
    message: "Vehicle limit exceeded",
  });
};

export const updateVehicleHandler = async (req: Request, res: Response) => {
  const userId = get(req, "user._id");
  const vehicleId = get(req, "params.id");

  const update = req.body;

  const vehicle = await findVehicleWithUser({ _id: vehicleId }, {});

  if (!vehicle) {
    return res.sendStatus(404);
  }

  if (String(vehicle.user) !== userId) {
    return res.sendStatus(401);
  }
  try {
    const updatedVehicle = await findAndUpdateVehicle(
      { _id: vehicleId },
      update,
      { new: true }
    );
    res.status(203).json({
      status: "success",
      data: {
        updatedVehicle,
      },
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      error: e,
    });
  }
};

export const getVehicleHandler = async (req: Request, res: Response) => {
  const vehicleId = get(req, "params.id");
  const vehicle = await findVehicle({ _id: vehicleId }, {});

  if (!vehicle) {
    res.sendStatus(404);
  }

  res.status(200).json({
    status: "success",
    data: {
      vehicle,
    },
  });
};

export const getVehiclesForUserHandler = async (
  req: Request,
  res: Response
) => {
  const userId = get(req, "user._id");
  const vehicles = await findVehicles({ user: userId }, {});
  res.status(200).send({
    status: "success",
    data: {
      vehicles,
    },
  });
};

export const deleteVehicleHandler = async (req: Request, res: Response) => {
  const userId = get(req, "user._id");
  const vehicleId = get(req, "params.id");

  const vehicle = await findVehicleWithUser({ _id: vehicleId }, {});

  if (!vehicle) {
    return res.sendStatus(404);
  }

  if (String(vehicle.user) !== String(userId)) {
    return res.sendStatus(401);
  }
  try {
    await deleteVehicle({ _id: vehicleId });

    return res.status(200).send({
      status: "success",
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      error: e,
    });
  }
};
