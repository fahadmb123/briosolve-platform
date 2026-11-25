import { ReviewResponseDto } from "./review-response.dto";

export interface AdminReviewsResponseDto {
  reviews: ReviewResponseDto[];
  reportedCount: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
  };
}
