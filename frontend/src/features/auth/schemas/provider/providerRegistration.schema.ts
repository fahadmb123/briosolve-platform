import { z } from "zod";

export const providerRegistrationSchema = z.object({
  fullName: z
    .string({ error: "Full name is required" })
    .trim()
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(50, { message: "Full name cannot exceed 50 characters" }),
  email: z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address format" }),
  businessName: z
    .string({ error: "Business name is required" })
    .trim()
    .min(2, { message: "Business name must be at least 2 characters" })
    .max(60, { message: "Business name cannot exceed 60 characters" }),
  password: z
    .string({ error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(64, { message: "Password cannot exceed 64 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Please confirm your password" }),
  services: z
    .array(z.string())
    .min(1, { message: "Please select at least one service" }),
  experience: z
    .string({ error: "Please select your experience" })
    .min(1, { message: "Please select your years of experience" }),
  bio: z
    .string({ error: "Bio is required" })
    .trim()
    .min(10, { message: "Please provide a brief professional overview (min 10 characters)" })
    .max(500, { message: "Bio cannot exceed 500 characters" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ProviderRegistrationInputType = z.infer<typeof providerRegistrationSchema>;
