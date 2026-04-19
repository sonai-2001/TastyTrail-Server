import { Restaurant } from "../../../models/restaurant.schema";
import { User } from "../../../models/user.schema.";
import { Otp } from "../../../models/otp.schema";
import { ApiError } from "../../../utils/ApiError";
import { generateAccessToken } from "../../../utils/generateJwt";
import { sendEmail } from "../../../utils/sendEmail";
import { LoginInput, LoginResponse } from "../dtos/loginDto";
import { RegisterInput, RegisterResponse } from "../dtos/registerDto";

export const sendOtpService = async (email: string): Promise<void> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError("Email already in use", 400);
  }

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Clear existing OTPs for this email and save new one
  await Otp.deleteMany({ email });
  await Otp.create({ email, otp });

  // Send Email
  await sendEmail({
    to: email,
    subject: "Your Tasty Trial Verification Code",
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
        <h2 style="color: #B12500;">Culinary Ledger Verification</h2>
        <p>Use the following secure code to verify your establishment's registration:</p>
        <div style="background: #f7f9ff; padding: 20px; text-align: center; border-radius: 8px;">
          <span style="font-size: 32px; font-weight: 900; letter-spacing: 5px; color: #1a1a1a;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 20px;">This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `
  });
};

export const registerService = async (
  data: RegisterInput
): Promise<RegisterResponse> => {

  const { name, email, phone, password, otp } = data;

  if (!otp) {
    throw new ApiError("Verification code is required", 400);
  }

  // Verify OTP
  const validOtp = await Otp.findOne({ email, otp });
  if (!validOtp) {
    throw new ApiError("Invalid or expired verification code", 400);
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { phone }]
  });

  if (existingUser) {
    throw new ApiError("User already exists", 400);
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    roles: ["user"], // safer than taking from body
    isEmailVerified: true // OTP was validated above, so email is confirmed
  });

  // Cleanup OTP
  await Otp.deleteOne({ _id: validOtp._id });

  const accessToken = generateAccessToken(user._id.toString());

  return {
    user,
    accessToken
  };
};

export const loginService = async (
  data: LoginInput
): Promise<LoginResponse> => {
// ... existing login code unchanged


  const { email, password } = data;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError("Invalid email or password", 401);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError("Invalid email or password", 401);
  }

  const accessToken = generateAccessToken(user._id.toString());

  const restaurants = await Restaurant.find({
    owner: user._id
  }).select("name _id")
  let restaurantCount = restaurants.length





  const userObj = user.toObject();
  delete userObj.password;

  return {
    user: userObj,
    accessToken,
    restaurantCount,
    restaurants
  };
};