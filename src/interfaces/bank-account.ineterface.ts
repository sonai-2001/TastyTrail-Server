import { Types } from "mongoose";
import { BankStatusEnum } from "../common/commonEnum";

export interface IBankAccount {
  outletId: Types.ObjectId;

  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  cancelledChequeDoc: string;
  status: BankStatusEnum;

  isDeleted: Boolean;

  createdAt: Date;
  updatedAt: Date;
}