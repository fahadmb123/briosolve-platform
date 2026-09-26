import { z } from "zod";

export const customerRegistrationSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(2, { error: "Name must be at least 2 characters" })
    .max(50, { error: "Name cannot exceed 50 characters" }),
    
  email: z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .email({ error: "Invalid email address format" }),
    
  password: z
    .string({ error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters" })
    .max(64, { error: "Password cannot exceed 64 characters" })
    .regex(/[A-Z]/, { error: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { error: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { error: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { error: "Password must contain at least one special character" }),
});


export const otpSchema = z.object({
    otp:z.string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must contain only numbers" })
  })



export type OtpInputType = z.infer<typeof otpSchema>;
export type CustomerRegistrationInputType = z.infer<typeof customerRegistrationSchema>;