import { RoleEnum, UserEnum, OnboardingStep, UserRole } from "../../common/commonEnum";
import bcrypt from "bcrypt";
import { sendEmail } from "../../utils/sendEmail";
import { ApiError } from "../../utils/ApiError";
import { User } from "../../models/user";
import { EmailOtp } from "../../models/Otp";
import { generateToken } from "../../utils/generateJwt";

interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  role: RoleEnum;
}

interface LoginInput {
  email: string;
  password: string;
  role?: RoleEnum;
}

export const registerService = async ({
  fullName,
  email,
  phone,
  password,
}: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}) => {
  // ✅ check existing user (email OR phone)
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingUser) {
    throw new ApiError("User with email or phone already exists", 400);
  }

  const user = await User.create({
    name: fullName,
    email,
    phone, // 🔥 important
    password,
    roles: [UserRole.USER],
  });

  return user;
};
export const loginService = async ({ email, password, role }: LoginInput) => {
  // 1️⃣ Find user by email
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError("Invalid credentials", 401);

  // 2️⃣ Check password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new ApiError("Invalid credentials", 401);

  // 3️⃣ Check if email verified
  if (!user.isEmailVerified) {
    await resendOtpService(user._id.toString());
    throw new ApiError("Email not verified. Please check your email for OTP", 400, {
      id: user._id,
      email: user.email,
      onboardingStep: user.activeRole === RoleEnum.ADMIN ? null : user.onboarding.get(user.activeRole)?.step,
    });
  }

  if (!role && user.roles.length > 1) {
    throw new ApiError("Multiple roles found. Please select role to login", 400, {
      id: user._id,
      email: user.email,
      roles: user.roles,
    });
  }

  const activeRole = role || user.roles[0];

  if (!user.roles.includes(activeRole)) {
    throw new ApiError("Invalid role for this user.", 400);
  }

  if (activeRole !== RoleEnum.ADMIN) {
    const roleStep = user.onboarding.get(activeRole)?.step;

    if (roleStep !== OnboardingStep.COMPLETED) {
      throw new ApiError("Onboarding not completed. Redirect to onboarding.", 400, {
        id: user._id,
        email: user.email,
        role: user.activeRole,
        onboardingStep: roleStep,
      });
    }
  }

  // 5️⃣ Generate JWT token (example)
  const token = generateToken(user._id, activeRole); // implement JWT utility

  user.activeRole = activeRole;
  await user.save();

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: activeRole,
    token,
  };
};
