import { UserRole } from "../common/commonEnum";
import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  roles: UserRole[];
  isActive: boolean;

  comparePassword(candidatePassword: string): Promise<boolean>;
  hasRole(role: UserRole): boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    roles: {
      type: [String],
      enum: Object.values(UserRole),
      default: [UserRole.USER],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔐 Hash password
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// 🔑 Compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) throw new Error("Password not selected");

  return bcrypt.compare(candidatePassword, this.password);
};

// 🎭 Role check helper
userSchema.methods.hasRole = function (role: UserRole): boolean {
  return this.roles.includes(role);
};

// 🚫 Hide sensitive data
userSchema.set("toJSON", {
  transform: function (_, ret) {
    delete ret.password;
    return ret;
  },
});

export const User = mongoose.model<IUser>("User", userSchema);