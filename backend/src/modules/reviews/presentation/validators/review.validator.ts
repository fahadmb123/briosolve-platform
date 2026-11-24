import { z } from "zod";

export const createReviewSchema = z.object({
  bookingId: z.string().uuid("Invalid booking identifier"),
  rating: z.number().int().min(1, "Rating must be at least 1 star").max(5, "Rating cannot exceed 5 stars"),
  title: z.string().trim().max(150, "Title cannot exceed 150 characters").optional().nullable(),
  comment: z.string().trim().min(5, "Comment must be at least 5 characters").max(2000, "Comment cannot exceed 2000 characters"),
  aspectRatings: z
    .object({
      punctuality: z.number().int().min(1).max(5).optional(),
      serviceQuality: z.number().int().min(1).max(5).optional(),
      communication: z.number().int().min(1).max(5).optional(),
      valueForMoney: z.number().int().min(1).max(5).optional()
    })
    .optional()
    .nullable()
});

export const replyReviewSchema = z.object({
  replyText: z.string().trim().min(2, "Reply text must be at least 2 characters").max(1500, "Reply text cannot exceed 1500 characters")
});

export const moderateReviewSchema = z.object({
  isHidden: z.boolean().optional(),
  isReported: z.boolean().optional()
});
