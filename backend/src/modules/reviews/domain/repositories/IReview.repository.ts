import { Review, ReviewAspectRatings } from "../entities/review.entity";

export interface CreateReviewRepoParams {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  rating: number;
  title?: string | null;
  comment: string;
  aspectRatings?: ReviewAspectRatings | null;
}

export interface GetProviderReviewsParams {
  providerId: string;
  rating?: number;
  page?: number;
  limit?: number;
  includeHidden?: boolean;
}

export interface ProviderReviewsResult {
  reviews: Review[];
  total: number;
  averageRating: number;
  ratingCounts: Record<number, number>;
}

export interface GetCustomerReviewsParams {
  customerId: string;
  page?: number;
  limit?: number;
}

export interface CustomerReviewsResult {
  reviews: Review[];
  total: number;
}

export interface GetAdminReviewsParams {
  search?: string;
  rating?: number;
  isReported?: boolean;
  isHidden?: boolean;
  page?: number;
  limit?: number;
}

export interface AdminReviewsResult {
  reviews: Review[];
  total: number;
  reportedCount: number;
}

export interface ReviewBookingEligibility {
  id: string;
  customerId: string;
  customerName?: string | null;
  providerId: string;
  providerUserId?: string | null;
  status: string;
  bookingNumber: string;
  serviceTitle: string | null;
}

export interface IReviewRepository {
  findBookingEligibility(bookingId: string): Promise<ReviewBookingEligibility | null>;
  createReview(params: CreateReviewRepoParams): Promise<Review>;
  findById(id: string): Promise<Review | null>;
  findByBookingId(bookingId: string): Promise<Review | null>;
  findProviderReviews(params: GetProviderReviewsParams): Promise<ProviderReviewsResult>;
  findCustomerReviews(params: GetCustomerReviewsParams): Promise<CustomerReviewsResult>;
  findAdminReviews(params: GetAdminReviewsParams): Promise<AdminReviewsResult>;
  replyToReview(reviewId: string, replyText: string): Promise<Review | null>;
  updateModeration(reviewId: string, data: { isHidden?: boolean; isReported?: boolean }): Promise<Review | null>;
  getProviderRatingSummary(providerId: string): Promise<{ averageRating: number; totalReviews: number; ratingCounts: Record<number, number> }>;
}
