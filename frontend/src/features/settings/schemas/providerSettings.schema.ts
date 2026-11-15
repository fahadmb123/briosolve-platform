import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().min(1, "Email address is required").email({ message: "Please enter a valid email address" })
});

export const phoneSchema = z
  .object({
    countryCode: z.string().min(1, "Country code is required"),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\d+$/, { message: "Phone number must contain digits only" }),
  })
  .superRefine((data, ctx) => {
    const digits = data.phoneNumber.replace(/\D/g, "");

    if (data.countryCode === "+91") {
      if (digits.length !== 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indian mobile number must be exactly 10 digits",
          path: ["phoneNumber"],
        });
      } else if (!/^[6-9]/.test(digits)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indian mobile number must start with 6, 7, 8, or 9",
          path: ["phoneNumber"],
        });
      }
    } else if (data.countryCode === "+1") {
      if (digits.length !== 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "US phone number must be exactly 10 digits",
          path: ["phoneNumber"],
        });
      } else if (!/^[2-9]/.test(digits)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "US phone number must start with 2-9",
          path: ["phoneNumber"],
        });
      }
    } else if (data.countryCode === "+44") {
      if (digits.length < 10 || digits.length > 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "UK phone number must be 10 or 11 digits",
          path: ["phoneNumber"],
        });
      }
    } else if (data.countryCode === "+61") {
      if (digits.length !== 9 && digits.length !== 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Australian phone number must be 9 or 10 digits",
          path: ["phoneNumber"],
        });
      }
    } else {
      if (digits.length < 7 || digits.length > 14) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number must be between 7 and 14 digits",
          path: ["phoneNumber"],
        });
      }
    }
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
  name: z
    .string()
    .trim()
    .min(1, { message: "Full name is required" })
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(50, { message: "Full name cannot exceed 50 characters" }),
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

export const serviceRadiusSchema = z.object({
  service_radius_km: z.number().int().min(1).max(500)
});

export type ServiceRadiusInputType = z.infer<typeof serviceRadiusSchema>;
