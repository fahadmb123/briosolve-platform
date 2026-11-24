import { ReviewAspectRatings } from "../../../domain/entities/review.entity";

export interface ReviewResponseDto {
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
