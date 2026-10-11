import { z } from "zod";

export const providerRegistrationSchema = z.object({
  fullName: z
    .string({ message: "Full Name is required" })
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
    
  businessName: z
    .string({ message: "Business name is required" })
    .min(1, { message: "Business name is required" })
});

export type ProviderRegistrationInputType = z.infer<typeof providerRegistrationSchema>;

export const providerProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name cannot exceed 50 characters" })
    .optional(),
  businessName: z
    .string()
    .trim()
    .min(1, { message: "Business name cannot be empty" })
    .max(255, { message: "Business name cannot exceed 255 characters" })
    .optional(),
  business_name: z
    .string()
    .trim()
    .min(1, { message: "Business name cannot be empty" })
    .max(255, { message: "Business name cannot exceed 255 characters" })
    .optional(),
  experience: z
    .string()
    .max(100, { message: "Experience cannot exceed 100 characters" })
    .optional(),
  bio: z
    .string()
    .max(2000, { message: "Bio cannot exceed 2000 characters" })
    .optional(),
  profile_image: z
    .string()
    .nullable()
    .optional(),
  service_radius_km: z
    .number()
    .int({ message: "Radius must be an integer" })
    .min(1, { message: "Radius must be at least 1 km" })
    .max(500, { message: "Radius cannot exceed 500 km" })
    .optional()
});

export type ProviderProfileSchemaType = z.infer<typeof providerProfileSchema>;
