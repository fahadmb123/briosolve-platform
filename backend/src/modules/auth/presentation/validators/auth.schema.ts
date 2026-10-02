import z from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }).min(6, { message: "Password must be at least 6 characters" }),
})
export const emailSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" })
})
export const phoneSchema = z.object({
    phone: z.string().min(1, { message: "Phone number is required" }).regex(/^\+[1-9]\d{4,14}$/, { message: "Invalid phone number format" })
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
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" })
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
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" })
})


export type ResetPasswordInputType = z.infer<typeof resetPasswordSchema>
export type EmailInputType = z.infer<typeof emailSchema>
export type LoginInputType = z.infer<typeof loginSchema>
export type UpdatePasswordType = z.infer<typeof updatePasswordSchema>
export type PhoneInputType = z.infer<typeof phoneSchema>