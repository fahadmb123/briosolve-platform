import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z
    .number({ message: "Please select a rating" })
    .int()
    .min(1, { message: "Rating must be at least 1 star" })
    .max(5, { message: "Rating cannot exceed 5 stars" }),
  comment: z
    .string({ message: "Please enter your review" })
    .trim()
    .min(1, { message: "Review cannot be empty" })
    .min(10, { message: "Review must be at least 10 characters long" })
    .max(1000, { message: "Review cannot exceed 1000 characters" })
});

export type CreateReviewFormData = z.infer<typeof createReviewSchema>;
