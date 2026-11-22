import { z } from "zod";

export const createTicketSchema = z.object({
  targetType: z.string().trim().min(2).max(50).optional().nullable(),
  targetId: z.string().trim().optional().nullable(),
  targetNumber: z.string().trim().optional().nullable(),
  bookingId: z.string().trim().optional().nullable(),
  bookingNumber: z.string().trim().optional().nullable(),
  serviceTitle: z.string().trim().optional().nullable(),
  category: z.string().trim().min(2, "Category is required").max(100).optional().nullable(),
  categoryLabel: z.string().trim().min(2, "Category label is required").max(100).optional().nullable(),
  subject: z
    .string()
    .trim()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject cannot exceed 200 characters"),
  description: z
    .string()
    .trim()
    .min(15, "Description must be at least 15 characters")
    .max(2000, "Description cannot exceed 2000 characters"),
  metadata: z.record(z.string(), z.any()).optional().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("HIGH").optional(),
  authorName: z.string().trim().optional().nullable()
}).superRefine((data, ctx) => {
  const isBooking = data.targetType === "BOOKING" || Boolean(data.bookingId || data.bookingNumber);
  if (isBooking && !data.targetId && !data.bookingId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select a booking to link with this ticket",
      path: ["targetId"]
    });
  }
});

export type CreateTicketSchema = z.infer<typeof createTicketSchema>;
