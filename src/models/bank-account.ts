import { model, Schema } from "mongoose";
import { BankStatusEnum } from "../common/commonEnum";
import { IBankAccount } from "../interfaces/bank-account.ineterface";

const bankAccountSchema = new Schema<IBankAccount>(
  {
    outletId: {
      type: Schema.Types.ObjectId,
      ref: "Outlet",
      required: true,
      unique: true,
      index: true,
    },

    accountHolderName: {
      type: String,
      required: true,
      trim: true,
    },

    bankName: {
      type: String,
      required: true,
      trim: true,
    },

    accountNumber: {
      type: String,
      required: true,
      select: false,
    },

    ifscCode: {
      type: String,
      required: true,
      uppercase: true,
    },

    cancelledChequeDoc: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(BankStatusEnum),
      default: BankStatusEnum.PENDING,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BankAccount = model<IBankAccount>(
  "BankAccount",
  bankAccountSchema
);