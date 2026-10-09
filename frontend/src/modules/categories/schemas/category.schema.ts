import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const addCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').toLowerCase(),
  description: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  rawImage: z.custom<File>((val) => val instanceof File, 'Image is required')
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Max image size is 5MB')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    )
    .optional()
});

export type AddCategoryFormData = z.infer<typeof addCategorySchema>;
