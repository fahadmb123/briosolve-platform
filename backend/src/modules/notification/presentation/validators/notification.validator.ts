import { z } from "zod";

export const createNotificationSchema = z.object({
  recipientId: z.string().uuid(),
  type: z.enum(["INFO", "SUCCESS", "WARNING", "ERROR"]),
  title: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(1000),
});


export const updateNotificationSchema = z
  .object({
    type: z.enum(["INFO", "SUCCESS", "WARNING", "ERROR"]).optional(),
    title: z.string().trim().min(1).max(150).optional(),
    message: z.string().trim().min(1).max(1000).optional(),
    isRead: z.boolean().optional(),
    readAt: z.coerce.date().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });