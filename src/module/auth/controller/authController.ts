import { asyncHandler } from "../../../middleware/asyncHandler";
import { success } from "../../../utils/responses";
import { loginService, registerService, sendOtpService } from "../services/authService";

export const sendOtpController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await sendOtpService(email);
  return success(res, {
    message: "Verification code sent to email",
    status: 200
  });
});

export const registerController = asyncHandler(async (req, res) => {
  const result = await registerService(req.body);
  return success(res, {
    data: result,
    message: "User registered successfully",
    status: 201
  });
});

export const loginController = asyncHandler(async (req, res) => {
  const result = await loginService(req.body);
  return success(res, {
    data: result,
    message: "Login successful"
  });
});
  