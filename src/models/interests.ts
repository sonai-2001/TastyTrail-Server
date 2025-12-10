import mongoose, { Document, Schema } from "mongoose";
import { statusEnum } from "../common/commonEnum";

interface IInterest{
    name:string,
    description:string,
    status:statusEnum.ACTIVE | statusEnum.INACTIVE,
    image:String
}


export interface IInterestDoc extends  IInterest,Document{}


const interestSchema=new Schema<IInterestDoc>({
  name:{
    type:String,
    required:true,
    unique:true
  },
  description:{
    type:String,
    max:30
  },
  status:{
    type: String,
    enum:[statusEnum.ACTIVE , statusEnum.INACTIVE],
    default:statusEnum.ACTIVE
  },
  image:{
    type:String
  }
  
},{timestamps:true})

export default mongoose.model<IInterestDoc>("Interests",interestSchema)