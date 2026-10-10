import { z } from "zod";



export const emailSchema = z.object({
  email: z.string().min(1, "Email address is required").email({ message: "Please enter a valid email address" })
})

export const phoneSchema = z.object({
  countryCode: z.string().min(1, "Country code required"),
  phoneNumber: z.string().min(1, "Phone number is required").regex(/^[0-9]{4,14}$/, { message: "Please enter a valid phone number" })
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

export const addressSchema = z.object({
  house_no: z.string().min(1, "House number is required"),
  area: z.string().min(1, "Area is required"),
  city: z.string().min(1, "City is required"),
  district: z.string().min(1, "District is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  pincode: z.string().length(6, "Pincode must be exactly 6 characters"),
  landmark: z.string().min(1, "Landmark is required")
});

export type AddressInputType = z.infer<typeof addressSchema>;

export interface AddressPayload extends AddressInputType {
  id?: string;
  type: string;
  latitude?: number | null;
  longitude?: number | null;
  isDefault?: boolean;
}
