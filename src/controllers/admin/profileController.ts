import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { error, success } from '../../utils/responses';
import { validateFields } from '../../utils/validation';
import * as profileService from '../../services/admin/profileService';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return error(res, { message: 'Not authenticated', status: 400 });
  }

  // return success(res, { data: { user: req.user }, message: 'Profile fetched' });
  const userId = req.user.id;
  console.log("🚀 ~ userId:", userId)
  const user = await profileService.findById(userId);
  console.log("🚀 ~ user:", user)
  if(!user) return error(res, {message: 'User not found', status: 404});
  return success(res, { data: { user }, message: 'Profile fetched' });
});