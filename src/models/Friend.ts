import mongoose, { Types,Schema, Document } from "mongoose";
import { friendStatus } from "../common/commonEnum";

interface IFriendSchema{
  sender: Types.ObjectId,
  reciver:Types.ObjectId,
  status: friendStatus.ACCEPTED | friendStatus.PENDING | friendStatus.REJECTED
}


interface IFriendDoc  extends  IFriendSchema,Document {}

const FriendSchema=new Schema<IFriendDoc>({
      sender:{
        type : Schema.Types.ObjectId,
        ref: 'User',
        required:true

        },
        reciver:{
            type:Schema.Types.ObjectId ,
            ref:'User',
            required:true
        },

        status:{
            type:String,
            enum :[friendStatus.ACCEPTED,friendStatus.PENDING,friendStatus.REJECTED],
            required:true,
            default:friendStatus.PENDING
        }
      },{timestamps:true})


    export const FriendModel=  mongoose.model<IFriendDoc>('Friend',FriendSchema)