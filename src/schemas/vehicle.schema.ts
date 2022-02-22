import { object, string, boolean, ref } from "yup";
const yearRegex = /^(19|20)\d{2}$/;

export const createVehicleSchema = object({
  body: object({
    company: string().required("Company name is required"),
    trim: string().required("Trim is required"),
    year: string()
      .required("Manufacturing year is required")
      .matches(yearRegex, "Year is not valid"),
    isPrimary: boolean().required("is this vehicle primary? info required"),
  }),
});

export const deleteVehicleSchema = object({
  params: object({
    id: string().required("Id is required"),
  }),
});

export const updateVehicleSchema = object({
  body: object({
    company: string().required("Company name is required"),
    trim: string().required("Trim is required"),
    year: string()
      .required("Manufacturing year is required")
      .matches(yearRegex, "Year is not valid"),
    isPrimary: boolean().required("is this vehicle primary? info required"),
  }),
  params: object({
    id: string().required("Id is required"),
  }),
});
