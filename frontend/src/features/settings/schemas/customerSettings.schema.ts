import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().min(1, "Email address is required").email({ message: "Please enter a valid email address" })
});

export const phoneSchema = z.object({
  countryCode: z.string().min(1, "Country code required"),
  phoneNumber: z.string().min(1, "Phone number is required").regex(/^[0-9]{4,14}$/, { message: "Please enter a valid phone number" })
});

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
});

export type EmailInputType = z.infer<typeof emailSchema>;
export type PhoneInputType = z.infer<typeof phoneSchema>;
export type UpdatePasswordInputType = z.infer<typeof updatePasswordSchema>;

export * from "../../addresses/schemas/address.schema";

export const serviceRadiusSchema = z.object({
  service_radius_km: z.number().int().min(1).max(500)
});

export type ServiceRadiusInputType = z.infer<typeof serviceRadiusSchema>;
