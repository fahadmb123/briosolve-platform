import { ReviewResponseDto } from "./review-response.dto";

export interface CustomerReviewsResponseDto {
  reviews: ReviewResponseDto[];
  averageRating: number;
  totalReviews: number;
  ratingCounts: Record<number, number>;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
  };
}
