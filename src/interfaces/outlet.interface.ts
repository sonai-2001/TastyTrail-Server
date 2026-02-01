import { Document, Types } from "mongoose";
import { OutletApprovalStatusEnum, OutletOperationalStatusEnum, ServiceTypeEnum } from "../common/commonEnum";

export interface IOutlet extends Document {
  ownerId: Types.ObjectId;
  name: string;
  code?: string;
  serviceType: ServiceTypeEnum;
  address: {
    line1: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };

  location: {
      type: "Point";
      coordinates: [number, number]; // [lng, lat]
    };

  contact: {
    phone: string;
    email?: string;
  };
  gstNumber?: string;       
  fssaiLicenseNumber:string;
  fssaiLicenseDoc:string;
  panNumber:string;
  panDoc:string;
  cousineType:Types.ObjectId;
  menuImages: string[]
  approvalStatus: OutletApprovalStatusEnum;
  operationalStatus: OutletOperationalStatusEnum;
  isDeleted: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
