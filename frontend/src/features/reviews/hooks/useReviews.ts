import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReview,
  getBookingReview,
  getMyReviews,
  getProviderReviews,
  replyToReview,
  getAdminReviews,
  moderateReview
} from "../services/review.service";
import type {
  CreateReviewPayload,
  GetCustomerReviewsQueryParams,
  GetProviderReviewsQueryParams,
  GetAdminReviewsQueryParams,
  ModerateReviewPayload
} from "../types/review.types";

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookingReview", variables.bookingId] });
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", variables.bookingId] });
    }
  });
};

export const useBookingReviewQuery = (bookingId?: string) => {
  return useQuery({
    queryKey: ["bookingReview", bookingId],
    queryFn: () => (bookingId ? getBookingReview(bookingId) : Promise.reject("No bookingId")),
    enabled: Boolean(bookingId)
  });
};

export const useMyReviewsQuery = (params?: GetCustomerReviewsQueryParams) => {
  return useQuery({
    queryKey: ["myReviews", params],
    queryFn: () => getMyReviews(params)
  });
};

export const useProviderReviewsQuery = (
  providerId?: string,
  params?: GetProviderReviewsQueryParams
) => {
  return useQuery({
    queryKey: ["providerReviews", providerId, params],
    queryFn: () => (providerId ? getProviderReviews(providerId, params) : Promise.reject("No providerId")),
    enabled: Boolean(providerId)
  });
};

export const useReplyToReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, replyText }: { reviewId: string; replyText: string }) =>
      replyToReview(reviewId, replyText),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["providerReviews"] });
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
      if (res?.data?.bookingId) {
        queryClient.invalidateQueries({ queryKey: ["bookingReview", res.data.bookingId] });
      }
    }
  });
};

export const useAdminReviewsQuery = (params?: GetAdminReviewsQueryParams) => {
  return useQuery({
    queryKey: ["adminReviews", params],
    queryFn: () => getAdminReviews(params)
  });
};

export const useModerateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, isHidden, isReported }: ModerateReviewPayload) =>
      moderateReview(reviewId, { isHidden, isReported }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
      queryClient.invalidateQueries({ queryKey: ["providerReviews"] });
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
      if (res?.data?.bookingId) {
        queryClient.invalidateQueries({ queryKey: ["bookingReview", res.data.bookingId] });
      }
    }
  });
};
