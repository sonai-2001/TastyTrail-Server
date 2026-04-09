import { asyncHandler } from "../../../middleware/asyncHandler";
import { ApiError } from "../../../utils/ApiError";
import { success } from "../../../utils/responses";

export const uploadController=asyncHandler(async(req,res)=>{
    if(!req.file){
        throw new ApiError("File is required",400)
    }
    const imageUrl= `uploads/${req.file.filename}`
    return success(res,{
        message:"File uploaded successfully",
        data:{
            imageUrl:imageUrl
        }
    })
    
})