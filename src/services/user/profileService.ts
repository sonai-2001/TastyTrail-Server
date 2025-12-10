import { statusEnum } from "../../common/commonEnum";
import User from "../../models/User";
import interest from "../../models/interests";

export async function findById(id: string) {
  return User.findById(id).select("+password").populate('interests','name description').lean();
}

export async function findByIdAndUpdate(id: string, data: any) {
  return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select("-password");
}

export const validateInterestId=async(interests:string[])=>{
const validInterests = await interest.find({ _id: { $in: interests },status: statusEnum.ACTIVE
 }).select("_id");
 return  validInterests
}
  