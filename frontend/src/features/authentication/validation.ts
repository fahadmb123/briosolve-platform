import { z } from "zod";

const requiredMessage = "Please fill the field";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: requiredMessage })
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: requiredMessage })
    .email({ message: "Please enter a valid email address" }),
  
  password: z
    .string()
    .min(1, { message: requiredMessage })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  
  confirmPassword: z
    .string()
    .min(1, { message: requiredMessage }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export type SignupInputType = z.infer<typeof signupSchema>;