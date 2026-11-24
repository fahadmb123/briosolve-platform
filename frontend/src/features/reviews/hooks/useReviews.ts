import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReview,
  getBookingReview,
  getMyReviews,
  getProviderReviews
} from "../services/review.service";
import type { CreateReviewPayload } from "../types/review.types";

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

export const useMyReviewsQuery = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["myReviews", page, limit],
    queryFn: () => getMyReviews(page, limit)
  });
};

export const useProviderReviewsQuery = (
  providerId?: string,
  rating?: number,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryKey: ["providerReviews", providerId, rating, page, limit],
    queryFn: () => (providerId ? getProviderReviews(providerId, rating, page, limit) : Promise.reject("No providerId")),
    enabled: Boolean(providerId)
  });
};
