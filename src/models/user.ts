import mongoose, { Document, Schema } from "mongoose";
import { RoleEnum, UserEnum } from "../common/commonEnum";
import bcrypt from 'bcrypt';


interface IUser extends Document
{
  name: string;
  email: string;
  password: string;
  role: string;
  status: UserEnum.ACTIVE | UserEnum.INACTIVE | UserEnum.PENDING;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;


  comparePassword(candidatePassword: string): Promise<boolean>;

  
 
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true ,select: false},
  role: {
    type: String,
    required: true,
    enum: [RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.RESTUAURANT_OWNER, RoleEnum.DELIVERY_PERSON],
    default: RoleEnum.USER,
  },
  status:{
    type: String,
    enum: UserEnum,
    default: UserEnum.PENDING,
  },
  isEmailVerified: { type: Boolean, default: false },

  
  
},{
  timestamps: true,
})

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export  const User = mongoose.model<IUser>('User', userSchema);
