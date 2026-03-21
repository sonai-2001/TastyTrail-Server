import mongoose, { Document, Schema } from "mongoose";

export interface IOwner extends Document {
  user: mongoose.Types.ObjectId;
  businessName: string;
  gstNumber?: string;
  isVerified: boolean;
}

const ownerSchema = new Schema<IOwner>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one owner profile per user
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    gstNumber: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Owner = mongoose.model<IOwner>("Owner", ownerSchema);