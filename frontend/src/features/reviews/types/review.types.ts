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
  bookingNumber?: string | null;
  serviceTitle?: string | null;
}

export interface CustomerReviewsResponse {
  reviews: ReviewItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProviderReviewsSummary {
  reviews: ReviewItem[];
  total: number;
  averageRating: number;
  ratingCounts: Record<number, number>;
  page: number;
  limit: number;
  totalPages: number;
}
