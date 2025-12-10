import { statusEnum } from "../../common/commonEnum";
import interests from "../../models/interests"
import { paginate } from "../shared/paginatedService";

interface CreateInterestPayload{
    name:string,
    description:string
}

interface getAllInterestsPayload{
  limit:number,
  page:number,
  status?:statusEnum.ACTIVE | statusEnum.INACTIVE
  search?:string
}

export const findByKey = async (key: string, value: any) => {
  const interest = await interests.findOne({ [key]: value });
  return interest;
};

export const CreateInterest=async (data:CreateInterestPayload)=>{
 const inerest=  await interests.create(data)
 return inerest

}

export const updateInterest=async(interestId:string,data:any)=>{
  const updatedInterest= await  interests.findByIdAndUpdate(interestId,data,{
      new:true,
      runValidators:true
     })

     return updatedInterest
}





export const interestDelete=async(interestId:string)=>{
 const deletedUser=  await interests.findByIdAndDelete(interestId)
 return deletedUser
}

export const getAllInterestsService=async(payload:getAllInterestsPayload)=>{
   const {page,limit,status,search}=payload

   let filter={} as any
   if(status){
    filter.status=status
   }
  return await paginate({model:interests, page,limit,filter,search,searchFields: ["name", "description"]  // 👈 CUSTOMIZABLE HERE
})



}