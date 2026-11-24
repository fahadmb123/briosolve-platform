import { ReviewAspectRatings } from "../../../domain/entities/review.entity";

export interface CreateReviewRequestDto {
  bookingId: string;
  customerId: string;
  rating: number;
  title?: string;
  comment: string;
  aspectRatings?: ReviewAspectRatings;
}
