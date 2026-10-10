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
