import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { success } from "../../utils/responses";
import { loginService, registerService, resendOtpService, verifyOtpService } from "../../services/auth/auth.service";



// login controller
export const login = asyncHandler(async (req: Request, res: Response) => {
const { email, password,role } = req.body;
const  loginResponse  = await loginService({ email, password,role });

success(res, { data: loginResponse, message: "User logged in successfully" });

});

// register controller
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, phone, password } = req.body;

  const user = await registerService({ fullName, email, phone, password });

  success(res, { data: user, message: "User registered successfully" });
});


// Verify OTP controller
export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { userId, otp } = req.body;
  const data = await verifyOtpService(userId, otp);
  success(res, { data, message: "Email verified successfully" });
});

// Resend OTP controller
export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;
  const data = await resendOtpService(userId);
  success(res, { data, message: "OTP resent successfully" });
});