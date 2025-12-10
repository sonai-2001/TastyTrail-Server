import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { error, success } from "../../utils/responses";
import { validateFields } from "../../utils/validation";
import * as interesService from '../../services/admin/adminInterestService';
import { statusEnum } from "../../common/commonEnum";
import path from "path";
import fs from "fs";


export const CreateInterests=asyncHandler(async(req:Request , res:Response)=>{
        const {interest_name , description}=req.body


        if(!interest_name || !description){
            return error(res,{
                message:'interest_name , description both are reuired',
                status:400
          })
        }

        const allowed=['interest_name','description']
       if(! validateFields(req.body,allowed,res)) return
       const image = req.file?.fieldname

       if(!image || !req.file?.filename){
        return error(res,{
          message:'image is requires',
          status:400,
          details:null
        })
       }
      const interest=await  interesService.findByKey('name',interest_name)
      if(interest){
     return error(
      res,
      {
        message:'This interest already exist',
        status:400,
        details:null
      }
     )
      }

      if(interest_name.length>40){
        return error(
           res,{
            message:'description word limit exceeded',
            status:400
           }
        )
      }

      const readyData={
        name:interest_name,
        description:description,
        image:req.file.filename

      }

    const createdInterest=  await   interesService.CreateInterest(readyData)

      return success(res,{
        data:createdInterest,
        message:'Interest created successfully',
        status:201
      })
      
      
})

export const getAllInterests=asyncHandler(async(req:Request, res:Response)=>{
      
const {page=1,limit=10,search,status} = req.body
  //  validation done not poluated body elements
   const allowed=["page","limit","search","status"]

   if(! validateFields(req.body,allowed,res)) return ;
  if (status) {
  if (!Object.values(statusEnum).includes(status)) {
    return error(res, {
      message: 'status is not valid',
      status: 400
    });
  }
}

   const result= await interesService.getAllInterestsService({
    page,limit,status,search
   })

   console.log('result',result)

   return success(res,{
    message:'All interests fetched succesfully',
    status:200,
    data:result.data,
    meta:result.meta
   })




})

export const updateInterests=asyncHandler(async(req:Request,res:Response)=>{
  const {interest_name,description}=req.body
 const interestId=req.params.interestId
 if(!interestId){
  return error(res,{
    message:'Interest id is missing',
    status:400
  })
 }

  const allowed=['interest_name','description'];
  if(! validateFields(req.body,allowed,res)) return 

 const interest= await interesService.findByKey('_id',interestId)
 if(!interest){
  return error(
    res,
    {
      message:'Interest not found',
      status:400,

    }
  )
 }
  let payload:{name?:string,description?:string,image?:string}={};
  if(interest_name){
    payload.name=interest_name
  }

  if(description){
    payload.description=description
  }

if (req.file?.filename) {
  const uploadDir = path.join(process.cwd(), "uploads", "interests");
  const oldImagePath = path.join(uploadDir, interest.image as string);

  if (interest.image && fs.existsSync(oldImagePath)) {
    console.log("Deleting Old Image:", oldImagePath);
    fs.unlinkSync(oldImagePath);
  }

  payload.image = req.file.filename;
}


  const updatedInterest= await interesService.updateInterest(interestId,payload )

  return success(res,{
    message:'Interest update succesfully',
    status:200,
    data:updatedInterest

  })








})


export const deleteInterest=asyncHandler(async(req:Request, res:Response)=>{
  const {interestId}=req.params
  if(!interestId){
    return error(res,{
      message:'interest id is missing',
      status:400
    })
  }


 const deletedUser= await interesService.interestDelete(interestId)
 return success(
  res,{
    message:'This interest has been deleted',
    status:200,
    data:deletedUser
  }
 )


})


export const statusChange =asyncHandler(async(req:Request,res:Response)=>{
     const {interestId}= req.params
     if(!interestId){
      return error(res,{
        message:'Interest id not present',
        status:400
      })
     }

     const interest= await interesService.findByKey('_id',interestId)
     if(!interest){
      return error(res,{
        message:'Interest not found',
        status:400
      })
     }

     if(interest.status=== statusEnum.ACTIVE){
      interest.status=statusEnum.INACTIVE
     }else if(interest.status=== statusEnum.INACTIVE){
      interest.status=statusEnum.ACTIVE

     }

    const newInterest= await interest.save()
    return success(res,{
      message:'Status changed sucessfully',
      status:200,
      data:newInterest
    })


})


export const getInterest=asyncHandler(async(req:Request,res:Response)=>{
      const {interestId}=req.params
      if(!interestId){
        return error(res,{
          message:'Interest id is not found',
          status:400
        })
      }

     const interest= await interesService.findByKey('_id',interestId)

     if(!interest){
       return error(res,{
        message:'No interest found',
        status:400
       })
     }

     return success(res,{
      message:'Interest fetched sucessfully',
      status:200,
      data:interest
     })
})