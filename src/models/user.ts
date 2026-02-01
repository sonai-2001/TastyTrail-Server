import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { RoleEnum, UserEnum, OnboardingStep } from "../common/commonEnum";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;

  /** Roles & Identity */
  roles: RoleEnum[];          // assigned roles
  activeRole: RoleEnum;       // currently operating role

  /** Account state */
  status: UserEnum;           // PENDING | ACTIVE | INACTIVE
  isEmailVerified: boolean;
  // onboardingStep: OnboardingStep;
   onboarding: Map<
    RoleEnum,
    {
      step: OnboardingStep;
    }
  >;

  /** Security */
  comparePassword(candidatePassword: string): Promise<boolean>;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    roles: {
      type: [String],
      enum: Object.values(RoleEnum),
      default: [RoleEnum.USER]
    },

    activeRole: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.USER
    },

    status: {
      type: String,
      enum: Object.values(UserEnum),
      default: UserEnum.PENDING
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },

    // onboardingStep: {
    //   type: String,
    //   enum: Object.values(OnboardingStep),
    //   default: OnboardingStep.REGISTERED
    // }
onboarding: {
  type: Map,
  of: new Schema(
    {
      step: {
        type: String,
        enum: Object.values(OnboardingStep),
        default: OnboardingStep.REGISTERED
      }
    },
    { _id: false }
  ),
  default: {}
}

  },
  { timestamps: true }
);

/* 🛡 Password hashing */
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* 🔑 Compare password method */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

/* 🛡 Hide password from JSON responses */
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  }
});

export const User = mongoose.model<IUser>("User", userSchema);
