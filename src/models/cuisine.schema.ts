import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICuisine extends Document {
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

const cuisineSchema = new Schema<ICuisine>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
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

cuisineSchema.index({ name: 1 });

export const Cuisine: Model<ICuisine> = mongoose.model<ICuisine>("Cuisine", cuisineSchema);
