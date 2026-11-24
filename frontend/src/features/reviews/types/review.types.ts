export interface ReviewAspectRatings {
  punctuality?: number;
  serviceQuality?: number;
  communication?: number;
  valueForMoney?: number;
}

export interface CreateReviewPayload {
  bookingId: string;
  rating: number;
  title?: string;
  comment: string;
  aspectRatings?: ReviewAspectRatings;
}

export interface ReviewItem {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  rating: number;
  title: string | null;
  comment: string;
  aspectRatings: ReviewAspectRatings | null;
  providerReply: string | null;
  providerRepliedAt: string | null;
  isReported: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  customerName?: string | null;
  customerAvatar?: string | null;
  providerName?: string | null;
  providerBusinessName?: string | null;
  providerAvatar?: string | null;
  providerUserId?: string | null;
  bookingNumber?: string | null;
  serviceTitle?: string | null;
}

export interface GetCustomerReviewsQueryParams {
  search?: string;
  rating?: number;
  page?: number;
  limit?: number;
}

export interface CustomerReviewsResponse {
  reviews: ReviewItem[];
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

export interface RatingBreakdownItem {
  stars: number;
  count: number;
  percentage: number;
}

export interface GetProviderReviewsQueryParams {
  search?: string;
  rating?: number;
  replied?: "REPLIED" | "UNREPLIED";
  page?: number;
  limit?: number;
}

export interface ProviderReviewsSummary {
  providerId: string;
  reviews: ReviewItem[];
  totalReviews: number;
  unrepliedCount: number;
  averageRating: number;
  ratingCounts: Record<number, number>;
  breakdown: RatingBreakdownItem[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
  };
}
