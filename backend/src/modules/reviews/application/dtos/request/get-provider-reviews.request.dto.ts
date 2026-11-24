export interface GetProviderReviewsRequestDto {
  providerId: string;
  rating?: number;
  page?: number;
  limit?: number;
  includeHidden?: boolean;
}
