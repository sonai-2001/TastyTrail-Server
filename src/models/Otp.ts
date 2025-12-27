import mongoose, { Schema, Document } from "mongoose";

export interface IEmailOtp extends Document {
  userId: Schema.Types.ObjectId;
  otpHash: string;      // hashed OTP
  expiresAt: Date;      // expiry time
  attempts: number;     // number of failed attempts
  createdAt: Date;
  updatedAt: Date;
}

const emailOtpSchema = new Schema<IEmailOtp>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const EmailOtp = mongoose.model<IEmailOtp>("EmailOtp", emailOtpSchema);
