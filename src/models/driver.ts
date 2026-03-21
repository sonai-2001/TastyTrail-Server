import mongoose, { Document, Schema } from "mongoose";

export interface IDriver extends Document {
  user: mongoose.Types.ObjectId;
  licenseNumber: string;
  vehicleType: string;
  isAvailable: boolean;
}

const driverSchema = new Schema<IDriver>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    licenseNumber: {
      type: String,
      required: true,
    },

    vehicleType: {
      type: String,
      enum: ["bike", "scooter", "car"],
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Driver = mongoose.model<IDriver>("Driver", driverSchema);