import { z } from "zod";

export const providerRegistrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  businessName: z.string().min(1, "Business name is required"),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  experience: z.string().min(1, "Please select your years of experience"),
  bio: z.string().min(10, "Please provide a brief professional overview (min 10 characters)")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ProviderRegistrationInputType = z.infer<typeof providerRegistrationSchema>;
