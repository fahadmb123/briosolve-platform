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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const imageFileSchema = z.any()
  .refine((file) => file !== null && file !== undefined, "Please select a file.")
  .refine((file) => file?.size <= MAX_FILE_SIZE, "Image size must be less than 5MB.")
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported."
  );
