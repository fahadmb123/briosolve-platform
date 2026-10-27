import { z } from "zod";

export const createNotificationSchema = z.object({
  recipientId: z.string().uuid(),
  type: z.enum(["INFO", "SUCCESS", "WARNING", "ERROR"]),
  title: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(1000),
});