import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  otp: z.string().length(6, "Verification code must be 6 digits"),
});

