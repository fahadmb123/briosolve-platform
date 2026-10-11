import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().min(1, "Email address is required").email({ message: "Please enter a valid email address" })
});

export const phoneSchema = z.object({
  countryCode: z.string().min(1, "Country code required"),
  phoneNumber: z.string().min(1, "Phone number is required").regex(/^[0-9]{4,14}$/, { message: "Please enter a valid phone number" })
});

export type EmailInputType = z.infer<typeof emailSchema>;
export type PhoneInputType = z.infer<typeof phoneSchema>;

export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" })
      .min(8, { message: "Password must be at least 8 characters" })
      .max(64, { message: "Password cannot exceed 64 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
    newPassword: z
      .string()
      .min(1, { message: "New password is required" })
      .min(8, { message: "Password must be at least 8 characters" })
      .max(64, { message: "Password cannot exceed 64 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your new password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type UpdatePasswordInputType = z.infer<typeof updatePasswordSchema>;

export const businessProfileSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(1, { message: "Business name is required" })
    .min(2, { message: "Business name must be at least 2 characters" })
    .max(100, { message: "Business name cannot exceed 100 characters" }),
  experience: z
    .string()
    .min(1, { message: "Please select your years of experience" }),
  bio: z
    .string()
    .trim()
    .min(1, { message: "Professional bio is required" })
    .min(10, { message: "Professional bio must be at least 10 characters" })
    .max(2000, { message: "Bio cannot exceed 2000 characters" })
});

export type BusinessProfileInputType = z.infer<typeof businessProfileSchema>;
