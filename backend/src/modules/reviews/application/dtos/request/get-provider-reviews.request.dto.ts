export interface GetProviderReviewsRequestDto {
  providerId: string;
  search?: string;
  rating?: number;
  replied?: "REPLIED" | "UNREPLIED";
  page?: number;
  limit?: number;
  includeHidden?: boolean;
}
