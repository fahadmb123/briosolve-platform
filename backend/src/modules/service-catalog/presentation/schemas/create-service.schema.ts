import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(1, "Service name is required").max(150, "Name is too long").toLowerCase(),
  category_id: z.string().uuid("Invalid category ID"),
  description: z.string().max(1000, "Description is too long").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE')
});
