import { z } from 'zod';

export const addCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  rawImage: z.custom<File>((val) => val instanceof File, 'Image is required').optional()
});

export type AddCategoryFormData = z.infer<typeof addCategorySchema>;
