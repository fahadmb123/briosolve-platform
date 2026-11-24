import { Review } from "../../domain/entities/review.entity";
import { ReviewResponseDto } from "../../application/dtos/response/review-response.dto";
import { CreateReviewRepoParams } from "../../domain/repositories/IReview.repository";
import { ReviewRatingService } from "../../application/services/review-rating.service";

export class ReviewMapper {
  public static toDomain(
    record: any,
    extra?: {
      customerName?: string | null;
      customerAvatar?: string | null;
      providerName?: string | null;
      providerBusinessName?: string | null;
      bookingNumber?: string | null;
      serviceTitle?: string | null;
    }
  ): Review {
    return new Review(
      record.id,
      record.booking_id,
      record.customer_id,
      record.provider_id,
      record.rating,
      record.title,
      record.comment,
      record.aspect_ratings as any,
      record.provider_reply,
      record.provider_replied_at ? new Date(record.provider_replied_at) : null,
      Boolean(record.is_reported),
      Boolean(record.is_hidden),
      new Date(record.created_at),
      new Date(record.updated_at),
      extra?.customerName,
      extra?.customerAvatar,
      extra?.providerName,
      extra?.providerBusinessName,
      extra?.bookingNumber,
      extra?.serviceTitle
    );
  }

  public static toDto(review: Review): ReviewResponseDto {
    return {
      id: review.id,
      bookingId: review.bookingId,
      customerId: review.customerId,
      providerId: review.providerId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      aspectRatings: review.aspectRatings,
      providerReply: review.providerReply,
      providerRepliedAt: review.providerRepliedAt ? ReviewRatingService.toIsoDateString(review.providerRepliedAt) : null,
      isReported: review.isReported,
      isHidden: review.isHidden,
      createdAt: ReviewRatingService.toIsoDateString(review.createdAt),
      updatedAt: ReviewRatingService.toIsoDateString(review.updatedAt),
      customerName: review.customerName,
      customerAvatar: review.customerAvatar,
      providerName: review.providerName,
      providerBusinessName: review.providerBusinessName,
      bookingNumber: review.bookingNumber,
      serviceTitle: review.serviceTitle
    };
  }

  public static toPersistence(params: CreateReviewRepoParams): Record<string, unknown> {
    return {
      id: params.id,
      booking_id: params.bookingId,
      customer_id: params.customerId,
      provider_id: params.providerId,
      rating: params.rating,
      title: params.title || null,
      comment: params.comment,
      aspect_ratings: params.aspectRatings || null,
      provider_reply: null,
      provider_replied_at: null,
      is_reported: false,
      is_hidden: false,
      created_at: new Date(),
      updated_at: new Date()
    };
  }
}
