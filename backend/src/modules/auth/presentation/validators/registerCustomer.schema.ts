import { z } from "zod";

export const customerRegistrationSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
    
  email: z
    .string({ message: "Email is required" })
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address format" }),
    
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(64, { message: "Password cannot exceed 64 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
});


export const otpSchema = z.object({
    otp:z.string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must contain only numbers" })
  })


export const profileSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  about: z
    .string()
    .max(500, { message: "Description cannot exceed 500 characters" })
    .optional(),
})



export type OtpInputType = z.infer<typeof otpSchema>;
export type ProfileSchemaType = z.infer<typeof profileSchema>;
export type CustomerRegistrationInputType = z.infer<typeof customerRegistrationSchema>;