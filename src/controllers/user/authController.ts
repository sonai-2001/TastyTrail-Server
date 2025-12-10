import { Request, Response } from 'express';
// import jwt, { SignOptions } from 'jsonwebtoken';
import { asyncHandler } from '../../middleware/asyncHandler';
import * as userService from '../../services/user/authService'
import { error, success } from '../../utils/responses';
import { signToken } from '../../services/shared/authService';
import validator from 'validator';
import { sendEmail } from "../../utils/sendEmail";
import crypto from "crypto";
import { validateFields } from '../../utils/validation';

export const signup = asyncHandler(async (req: Request, res: Response) => {
  console.log('check')
  const { name, email, password } = req.body;

  if (!name || !email || !password) return error(res, { message: 'name, email, password are required', status: 400 });
  const allowed = ["name", "email", "password"];
  if (!validateFields(req.body, allowed, res)) return; // stops execution if invalid


  if (!validator.isEmail(email)) {
    return error(res, { message: 'Invalid email address', status: 400 });
  }


  
  const existing = await userService.findByEmail(email);
  if (existing) return error(res, { message: 'Email already used', status: 409 });

  const user = await userService.createUser({ name, email, password });
  // const payload = { id: user._id, email: user.email, role: user.role };
  // const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN });

  return success(res, { data: { user: { id: user._id, email: user.email, name: user.name } }, status: 201, message: 'Registered' });
});


export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, fcmToken } = req.body; // fcmToken sent from device
  if (!email || !password) {
    return error(res, { message: "Validation failed", status: 400 });
  }

   const allowed = [ "email", "password", "fcmToken"];
  if (!validateFields(req.body, allowed, res)) return; // stops execution if invalid

  const user = await userService.findByEmail(email);
  if (!user) return error(res, { message: "Invalid credentials", status: 400 });

  const match = await user.comparePassword(password);

  if (!match) return error(res, { message: "Invalid credentials", status: 400 });

  // Generate JWT
  const payload = { id: user._id, email: user.email, role: user.role };
  const token = signToken(payload);

  // Save token and FCM token for single-session
  user.activeToken = token;
  if (fcmToken) user.fcmToken = fcmToken; // save device token for notifications
 const returnUser= await user.save();
 console.log('returnUser is ', returnUser)
  const hasInterests = returnUser?.interests?.length > 0;
 const dataObject ={
   token,
   hasInterests
 }

  return success(res, {
    data: dataObject,
    message: "Logged in successfully"
  });
});


// -------------------- FORGOT PASSWORD --------------------
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return error(res, { message: "Email is required", status: 400 });
    const allowed = ["email"];
  if (!validateFields(req.body, allowed, res)) return; // stops execution if invalid
  const user = await userService.findByEmail(email);
  if (!user) return error(res, { message: "User not found", status: 404 });

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;

  // Send email using EJS template
  await sendEmail(user.email, "Reset Your Password", "resetPassword", {
    name: user.name,
    resetLink
  });

  return success(res, { message: "Password reset link sent to your email" });
});

// -------------------- RESET PASSWORD --------------------
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) return error(res, { message: "Password is required", status: 400 });
  const allowed = ["password"];
  if (!validateFields(req.body, allowed, res)) return; // stops execution if invalid
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await userService.findByResetToken(hashedToken);
   console.log('user is ', user)
  if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) {
    return error(res, { message: "Invalid or expired reset token", status: 400 });
  }

  // Update password and clear token
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return success(res, { message: "Password has been reset successfully" });
});



export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return error(res, { message: 'Not authenticated', status: 400 });
  }
  // return success(res, { data: { user: req.user }, message: 'Profile fetched' });
  const userId= req.user.id;
  const user = await userService.findById(userId);
  return success(res, { data: { user }, message: 'Profile fetched' });
});

export const test =asyncHandler(async (req: Request, res: Response) => {
  return success(res, { data: {message:'hi'}, message: 'Profile fetched' });
});
