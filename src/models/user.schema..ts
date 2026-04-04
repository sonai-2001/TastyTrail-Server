import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export type UserRole = "user" | "res_partner" | "driver" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password?: string;
  roles: UserRole[];
  profileImage?: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt?: Date;

  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    roles: {
      type: [String],
      enum: ["user", "res_partner", "driver", "admin"],
      default: ["user"]
    },

    profileImage: {
      type: String,
      default: null
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },

    isPhoneVerified: {
      type: Boolean,
      default: false
    },

    lastLoginAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

/*
Password Hash Middleware
*/
userSchema.pre("save", async function (next) {

  if (!this.isModified("password")) return next();

  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

/*
Compare Password Method
*/
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);