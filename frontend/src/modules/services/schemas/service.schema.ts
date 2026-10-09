import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const serviceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(150, "Name is too long"),
  categoryId: z.string().min(1, "Parent Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description is too long"),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  rawImage: z.custom<File>((val) => val instanceof File, 'Image is required')
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Max image size is 5MB')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    )
    .optional()
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
