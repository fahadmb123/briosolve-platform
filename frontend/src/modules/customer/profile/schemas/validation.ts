import {z} from "zod"



export const nameSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  about: z
    .string()
    .max(500, { message: "Description cannot exceed 500 characters" })
    .optional(),
})






export type NameInputType = z.infer<typeof nameSchema>
