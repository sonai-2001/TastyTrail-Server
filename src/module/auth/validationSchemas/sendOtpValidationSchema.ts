import { z } from "zod";
export const sendOtpValidationSchema = z.object({
    email:z.email('Invalid email')
})
    