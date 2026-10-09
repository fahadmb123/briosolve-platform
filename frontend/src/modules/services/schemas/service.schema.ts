import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(150, "Name is too long"),
  categoryId: z.string().min(1, "Parent Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description is too long"),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
