import {
  DocumentDefinition,
  QueryOptions,
  UpdateQuery,
  FilterQuery,
} from "mongoose";
import Vehicle, { VehicleDocument } from "../model/vehicle.model";

export const createVehicle = (input: DocumentDefinition<VehicleDocument>) => {
  const newVehicle = Vehicle.create(input);
  return newVehicle;
};

export const findVehicle = async (
  query: FilterQuery<VehicleDocument>,
  options: QueryOptions
) => {
  const vehicle = await Vehicle.findOne(query, { user: 0 }, options).exec();
  return vehicle;
};

export const findVehicleWithUser = async (
  query: FilterQuery<VehicleDocument>,
  options: QueryOptions
) => {
  const vehicle = await Vehicle.findById(query, options).exec();
  return vehicle;
};

export const findVehicles = async (
  query: FilterQuery<VehicleDocument>,
  options: QueryOptions
) => {
  const vehicles = await Vehicle.find(query, { user: 0 }, options).exec();
  return vehicles;
};

export const findAndUpdateVehicle = async (
  query: FilterQuery<VehicleDocument>,
  update: UpdateQuery<VehicleDocument>,
  options: QueryOptions
) => {
  const updatedVehicle = await Vehicle.findByIdAndUpdate(query, update, options);
  return updatedVehicle;
};

export const deleteVehicle = async (query: FilterQuery<VehicleDocument>) => {
  return Vehicle.deleteOne(query).exec();
};
