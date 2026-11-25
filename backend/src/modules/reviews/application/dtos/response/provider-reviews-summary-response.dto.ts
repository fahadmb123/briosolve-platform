import { ReviewResponseDto } from "./review-response.dto";

export interface RatingBreakdownItemDto {
  stars: number;
  count: number;
  percentage: number;
}

export interface ProviderReviewsSummaryResponseDto {
  providerId: string;
  averageRating: number;
  totalReviews: number;
  unrepliedCount: number;
  ratingCounts: Record<number, number>;
  breakdown: RatingBreakdownItemDto[];
  reviews: ReviewResponseDto[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
  };
}
