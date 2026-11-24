import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";
import type {
  CreateReviewPayload,
  ReviewItem,
  CustomerReviewsResponse,
  GetCustomerReviewsQueryParams,
  ProviderReviewsSummary
} from "../types/review.types";

export const createReview = async (
  payload: CreateReviewPayload
): Promise<response<ReviewItem>> => {
  const res = await apiClient.post<response<ReviewItem>>("/api/reviews", payload);
  return res.data;
};

export const getBookingReview = async (
  bookingId: string
): Promise<response<ReviewItem | null>> => {
  const res = await apiClient.get<response<ReviewItem | null>>(`/api/reviews/booking/${bookingId}`);
  return res.data;
};

export const getMyReviews = async (
  params?: GetCustomerReviewsQueryParams
): Promise<response<CustomerReviewsResponse>> => {
  const res = await apiClient.get<response<CustomerReviewsResponse>>("/api/reviews/my", {
    params
  });
  return res.data;
};

export const getProviderReviews = async (
  providerId: string,
  rating?: number,
  page: number = 1,
  limit: number = 10
): Promise<response<ProviderReviewsSummary>> => {
  const res = await apiClient.get<response<ProviderReviewsSummary>>(`/api/reviews/provider/${providerId}`, {
    params: { rating, page, limit }
  });
  return res.data;
};
