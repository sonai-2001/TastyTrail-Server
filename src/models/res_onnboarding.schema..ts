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

interface IRestaurantDetails {
  restaurantName?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  cuisines?: mongoose.Types.ObjectId[];
  gstNumber?: string;
  fssaiNumber?: string;
  images?: string[];
}

interface IPaymentDetails {
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
}

export interface IRestaurantOnboarding extends Document {
  user: mongoose.Types.ObjectId;

  step: number;

  completed: boolean;

  serviceType?: ServiceType;

  restaurantDetails?: IRestaurantDetails;

  serviceAvailability?: IServiceAvailability[];

  paymentDetails?: IPaymentDetails;
  status: "draft" | "pending" | "approved" | "rejected";
  rejectionReason?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  restaurantId?: mongoose.Types.ObjectId;

}

const restaurantOnboardingSchema = new Schema<IRestaurantOnboarding>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    step: {
      type: Number,
      default: 1
    },

    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected"],
      default: "draft",
      index: true
    },

    rejectionReason: String,

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    reviewedAt: Date,

    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant"
    },

    serviceType: {
      type: String,
      enum: ["delivery_dining", "delivery_only", "dining_only"]
    },

    restaurantDetails: {
      restaurantName: String,
      ownerName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      pincode: String,
      cuisines: [{
        type: Schema.Types.ObjectId,
        ref: "Cuisine"
      }],
      gstNumber: String,
      fssaiNumber: String,
      images: [String]
    },

    serviceAvailability: [
      {
        day: String,
        openTime: String,
        closeTime: String,
        isOpen: Boolean
      }
    ],

    paymentDetails: {
      accountHolderName: String,
      bankName: String,
      accountNumber: String,
      ifscCode: String,
      upiId: String
    }
  },
  {
    timestamps: true
  }
);

restaurantOnboardingSchema.index({ user: 1 });

export const RestaurantOnboarding: Model<IRestaurantOnboarding> =
  mongoose.model<IRestaurantOnboarding>(
    "RestaurantOnboarding",
    restaurantOnboardingSchema
  );