import mongoose from "mongoose";
import { UserDocument } from "./user.model";
export interface VehicleDocument extends mongoose.Document {
  user: UserDocument["_id"];
  company: string;
  trim: string;
  year: number;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    company: {
      type: String,
      required: [true, "A vehicel must have a company name"],
      trim: true,
      maxLength: [12, "A name should not be longer than 12 characters"],
    },
    trim: {
      type: String,
      required: [true, "A vehicel must have a model name"],
      trim: true,
      maxLength: [12, "A name should not be longer than 12 characters"],
    },
    year: {
      type: String,
      required: [true, "A vehicel must have a manufacturing year"],
      trim: true,
      validate: {
        validator: function (val: string) {
          // this keyword only points to current document when creating new document
          return /^(19|20)\d{2}$/.test(val);
        },
        message: "Year formate is not valid",
      },
    },
    isPrimary: {
      type: Boolean,
      required: [true, "Is this vehicle primay? Information required"],
    },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model<VehicleDocument>("Vehicle", vehicleSchema);

export default Vehicle;
