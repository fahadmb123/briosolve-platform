import { z } from "zod";



export const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" })
})

export const phoneSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number" })
})



export type EmailInputType = z.infer<typeof emailSchema>;
export type PhoneInputType = z.infer<typeof phoneSchema>;
