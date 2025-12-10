import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { error, success } from "../../utils/responses";
import * as userService from "../../services/user/profileService";
import { validateFields } from "../../utils/validation";
import * as profileService from "../../services/user/profileService"
import mongoose from "mongoose";

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return error(res, { message: "Not authenticated", status: 400 });
  }

  // return success(res, { data: { user: req.user }, message: 'Profile fetched' });
  const userId = req.user.id;
  const user = await userService.findById(userId);
  console.log("user is ", user);
  return success(res, { data: { user }, message: "Profile fetched" });
});

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return error(res, { message: "Not authenticated", status: 400 });
    }

        const allowed = ["name", "bio", "profilePicture","interests"];
       if(!validateFields(req.body,allowed,res)) return 
      console.log('req.user body is  is ', req.body)

    const userId = req.user.id;
    const uploadedFile = req.file;
    const { name, bio , interests } = req.body;


    // Build update data
    const updateData: any = {};

    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if(interests){
         if(interests.length<=0){
          return error (res,{
            message:'interest list can not be empty',
            status:400
          })
         }else{
          updateData.interests=interests
         }
    }
    if (uploadedFile) updateData.profilePicture = uploadedFile.filename;


    // const filedTovalid= {
    //   ...updateData,
    //   ...req.body
    // }
    // if (!validateFields(filedTovalid, allowed, res)) return; // stops execution if invalid

    // Validate that at least one field is being updated
    const updateFields = Object.keys(updateData);

    if (updateFields.length === 0) {
      return error(res, {
        message:
          "At least one field must be provided for update: name, bio, or profilePicture",
        status: 400,
      });
    }


    const updatedUser = await userService.findByIdAndUpdate(userId, updateData);

    return success(res, {
      data: updatedUser,
      message: "Profile updated successfully",
      status: 200,
    });
  }
);

export const setInterests=asyncHandler(async(req:Request, res:Response)=>{
    if (!req.user) {
      return error(res, { message: "Not authenticated", status: 400 });
    }
    const userId = req.user.id;
    const { interests } = req.body;
    if(!interests) return error(res, { message: "Interests are required", status: 400 });
    if (interests.length===0) return error(res, { message: "Interests field cannot be empty", status: 400 });
    const allowed = ["interests"];
    if (!validateFields(req.body, allowed, res)) return; // stops execution if invalid

    if (!interests.every((id: string) => mongoose.Types.ObjectId.isValid(id))) {
      return error(res, { message: "Invalid interest ID format", status: 400 });
}
     const validateInterests=   await  profileService.validateInterestId(interests)

     if(validateInterests.length != interests.length){
      return error(res,{
        message:'Some interests are invalid',
        status:400
      })
     }

    const updatedUser = await userService.findByIdAndUpdate(userId, { interests });
    return success(res, {
      data: updatedUser,
      message: "Interests updated successfully",
      status: 200,
    });
})

export const changePassword=asyncHandler(async(req:Request, res:Response)=>{
  if (!req.user) {
    return error(res, { message: "Not authenticated", status: 400 });
  }
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;
  if(!oldPassword || !newPassword) return error(res, { message: "Both oldPassword and newPassword are required", status: 400 });
  const allowed = ["oldPassword", "newPassword"];
  if (!validateFields(req.body, allowed, res)) return; // stops execution if invalid
  const user = await userService.findById(userId);
  if (!user) return error(res, { message: "User not found", status: 404 });
  const match = await user.comparePassword(oldPassword);
  if (!match) return error(res, { message: "The Previous Password is Incorrect", status: 400 });
  user.password = newPassword;
  await user.save();
  return success(res, { message: "Password has been changed successfully" });
})
