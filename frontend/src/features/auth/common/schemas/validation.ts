import { z } from "zod"



export const otpSchema = z.object({
  otp: z.string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must contain only numbers" })
})

export type OtpInputType = z.infer<typeof otpSchema>;

export const loginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }).min(6, { message: "Password must be at least 6 characters" }),
})

export const emailSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" })
})

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(64, { message: "Password cannot exceed 64 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Please fill the field" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});




export type EmailInputType = z.infer<typeof emailSchema>;
export type LoginInputType = z.infer<typeof loginSchema>;
export type ResetPasswordInputType = z.infer<typeof resetPasswordSchema>;

export { providerRegistrationSchema, type ProviderRegistrationInputType } from '../../provider/schemas/providerRegistration.schema';

export const accountReactivationSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  reason: z
    .string()
    .min(1, { message: "Reason is required" })
    .min(11, { message: "Reason must be greater than 10 characters" })
});

export type AccountReactivationInputType = z.infer<typeof accountReactivationSchema>;
