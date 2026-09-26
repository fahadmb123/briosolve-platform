import {z} from "zod"



export const otpSchema = z.object({
    otp:z.string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must contain only numbers" })
  })



export type OtpInputType = z.infer<typeof otpSchema>;