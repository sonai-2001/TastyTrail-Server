import { model, Schema } from "mongoose";
import { OutletApprovalStatusEnum, OutletOperationalStatusEnum, ServiceTypeEnum } from "../common/commonEnum";
import { IOutlet } from "../interfaces/outlet.interface";

const outletSchema = new Schema<IOutlet>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      unique: true,
    },
    serviceType: {
      type: String,
      enum: Object.values(ServiceTypeEnum),
      required: true,
    },
    address: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, default: "India" },
      pincode: { type: String, required: true },
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        index: "2dsphere",
      },
    },

    contact: {
      phone: { type: String, required: true },
      email: { type: String },
    },
    cousineType: { type: Schema.Types.ObjectId, required: true },
    menuImages: [{ type: String, required: true }],
    gstNumber: { type: String, trim: true },
    fssaiLicenseNumber: { type: String, required: true },
    fssaiLicenseDoc: { type: String, required: true },
    panNumber: { type: String, required: true },
    panDoc: { type: String, required: true },
    approvalStatus: {
      type: String,
      enum: Object.values(OutletApprovalStatusEnum),
      default: OutletApprovalStatusEnum.PENDING,
    },
    operationalStatus: {
      type: String,
      enum: Object.values(OutletOperationalStatusEnum),
      default: OutletOperationalStatusEnum.INACTIVE,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  },
);

outletSchema.index({ location: "2dsphere" });

export const Outlet = model<IOutlet>("Outlet", outletSchema);
