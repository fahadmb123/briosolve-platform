import { ReviewResponseDto } from "./review-response.dto";

export interface CustomerReviewsResponseDto {
  reviews: ReviewResponseDto[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
  };
}
