
import { RoleEnum, UserEnum, OnboardingStep } from "../../common/commonEnum";
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
  role?:RoleEnum;
}


export const registerService = async ({
  fullName,
  email,
  password,
  role 
}: RegisterInput) => {
  // 1️⃣ Validate required fields
  if (!fullName || !email || !password || !role) {
    throw new ApiError("Full name, email, password and role are required", 400);
  }

  // 2️⃣ Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError("Invalid email address", 400);
  }

  // 3️⃣ Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // throw new ApiError("Email already registered please login", 409);

    if (existingUser.roles.includes(role)) {
    throw new ApiError(`Already registered as ${role}`, 409);
  }

  // add new role
  existingUser.roles.push(role);
  existingUser.onboarding.set(role, { step: OnboardingStep.REGISTERED });

  await existingUser.save();

  return {
    id: existingUser._id,
    email: existingUser.email,
    role,
    onboardingStep: OnboardingStep.REGISTERED,
    message: `Role ${role} added successfully`
  };
  }

  // 4️⃣ Create user
  const user = await User.create({
    fullName,
    email,
    password, // hashed automatically by pre-save hook
    roles: [role],
    activeRole: role,
    status: UserEnum.PENDING,
    isEmailVerified: false,
    // onboardingStep: OnboardingStep.REGISTERED,
     onboarding: new Map([
      [role, { step: OnboardingStep.REGISTERED }]
    ])
  });

  // 5️⃣ Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await EmailOtp.create({
    userId: user._id,
    otpHash,
    expiresAt,
    attempts: 0
  });

  const html = `
  <div style="font-family: sans-serif; text-align: center;">
    <h2>Welcome to MyApp!</h2>
    <p>Your verification code is:</p>
    <h1 style="color: #4CAF50;">${otp}</h1>
    <p>This code will expire in 10 minutes.</p>
  </div>
`;

await sendEmail({
  to: user.email,
  subject: "Verify Your Email",
  html
});


  // 7️⃣ Return minimal safe user info
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: role,
    // onboardingStep: user.onboardingStep,
     onboardingStep: OnboardingStep.REGISTERED,
    message: "Registration successful, please verify your email"
  };
};



export const verifyOtpService = async (userId: string, otp: string) => {
  const otpRecord = await EmailOtp.findOne({ userId });

  if (!otpRecord) {
    throw new ApiError("No OTP found. Please request a new one", 404);
  }

  if (otpRecord.expiresAt < new Date()) {
    await otpRecord.deleteOne();
    throw new ApiError("OTP expired. Please request a new one", 400);
  }

  const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
  if (!isValid) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new ApiError("Invalid OTP", 400);
  }

  // OTP valid → update user
  const user = await User.findById(userId);
  if (!user) throw new ApiError("User not found", 404);

  user.isEmailVerified = true;
  user.status = UserEnum.ACTIVE;

  // if (user.activeRole !== RoleEnum.ADMIN) {
  //   user.onboarding.set(user.activeRole, {
  //     step: OnboardingStep.EMAIL_VERIFIED
  //   });
  // }

  await user.save();

  // Delete OTP after verification
  await otpRecord.deleteOne();

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.activeRole,
    // onboardingStep: user.onboardingStep,
    onboardingStep:
      user.activeRole === RoleEnum.ADMIN
        ? null
        : user.onboarding.get(user.activeRole)?.step,
    message: "Email verified successfully"
  };
};



export const resendOtpService = async (userId: string , duringLogin=false) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError("User not found", 404);
  if (user.isEmailVerified) throw new ApiError("Email already verified", 400);

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save OTP (overwrite existing)
  await EmailOtp.findOneAndUpdate(
    { userId },
    { otpHash, expiresAt, attempts: 0 },
    { upsert: true }
  );
  const subject = duringLogin ? "Otp has been sent" : "Resend OTP - MyApp";
  // Send OTP via HTML email
  const html = `
    <div style="font-family: sans-serif; text-align: center;">
      <h2>Verify Your Email</h2>
      <p>Your OTP is:</p>
      <h1 style="color: #4CAF50;">${otp}</h1>
      <p>It will expire in 10 minutes.</p>
    </div>
  `;
  await sendEmail({
    to: user.email,
    subject: subject,
    html
  });

  return { message: `OTP ${duringLogin ? 'sent' : 'resent'} successfully` };
};



export const loginService = async ({ email, password,role }: LoginInput) => {
  // 1️⃣ Find user by email
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError("Invalid credentials", 401);

  // 2️⃣ Check password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new ApiError("Invalid credentials", 401);

  // 3️⃣ Check if email verified
  if (!user.isEmailVerified) {

    await resendOtpService(user._id.toString());
    return {
      id: user._id,
      email: user.email,
      // onboardingStep: user.onboardingStep,
      onboardingStep: user.activeRole === RoleEnum.ADMIN ? null : user.onboarding.get(user.activeRole)?.step,
      message: "Email not verified. Please check your email for OTP"
    };
  }

  if(!role && user.roles.length>1){
    return {
      id: user._id,
      email: user.email,
      roles: user.roles,
      message: "Multiple roles found. Please select role to login"
    }
  }

  const activeRole=role || user.roles[0];



  // 4️⃣ Check onboarding step
  // if (user.onboardingStep !== OnboardingStep.COMPLETED) {
  //   return {
  //     id: user._id,
  //     email: user.email,
  //     role: user.activeRole,
  //     onboardingStep: user.onboardingStep,
  //     message: "Onboarding not completed. Redirect to onboarding."
  //   };
  // }

  if (activeRole !== RoleEnum.ADMIN) {
    const roleStep = user.onboarding.get(activeRole)?.step;

    if (roleStep !== OnboardingStep.COMPLETED) {
      return {
        id: user._id,
        email: user.email,
        role: activeRole,
        onboardingStep: roleStep,
        message: "Onboarding not completed. Redirect to onboarding."
      };
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
    message: "Login successful"
  };
};

