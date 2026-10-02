import { z } from "zod";



export const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" })
})

export const phoneSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number" })
})

export const updatePasswordSchema = z.object({
  currentPassword: z
        .string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" })
        .max(64, { message: "Password cannot exceed 64 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  newPassword: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" })
      .max(64, { message: "Password cannot exceed 64 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export type EmailInputType = z.infer<typeof emailSchema>;
export type PhoneInputType = z.infer<typeof phoneSchema>;
export type UpdatePasswordInputType = z.infer<typeof updatePasswordSchema>;
