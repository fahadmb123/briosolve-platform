export interface GetAdminReviewsRequestDto {
  search?: string;
  rating?: number;
  isReported?: boolean;
  isHidden?: boolean;
  page?: number;
  limit?: number;
}
