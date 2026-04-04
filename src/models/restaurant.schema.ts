import mongoose, { Schema, Document, Model } from "mongoose";

export type ServiceType =
  | "delivery_dining"
  | "delivery_only"
  | "dining_only";

interface IServiceAvailability {
  day: string;
  openTime?: string;
  closeTime?: string;
  isOpen: boolean;
}

export interface IRestaurant extends Document {
  owner: mongoose.Types.ObjectId;

  name: string;

  serviceType: ServiceType;

  address: string;

  city: string;

  pincode: string;

  cuisines: string[];

  images?: string[];

  availability?: IServiceAvailability[];

  rating: number;

  isActive: boolean;
}

const restaurantSchema = new Schema<IRestaurant>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    serviceType: {
      type: String,
      enum: ["delivery_dining", "delivery_only", "dining_only"],
      required: true
    },

    address: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    pincode: {
      type: String,
      required: true
    },

    cuisines: {
      type: [String],
      default: []
    },

    images: {
      type: [String],
      default: []
    },

    availability: [
      {
        day: String,
        openTime: String,
        closeTime: String,
        isOpen: Boolean
      }
    ],

    rating: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

restaurantSchema.index({ owner: 1 });

export const Restaurant: Model<IRestaurant> =
  mongoose.model<IRestaurant>("Restaurant", restaurantSchema);