import {z} from "zod"



export const otpSchema = z.object({
    otp:z.string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must contain only numbers" })
  })

export type OtpInputType = z.infer<typeof otpSchema>;

export const loginSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }).min(6, { message: "Password must be at least 6 characters" }),
})

export type LoginInputType = z.infer<typeof loginSchema>;