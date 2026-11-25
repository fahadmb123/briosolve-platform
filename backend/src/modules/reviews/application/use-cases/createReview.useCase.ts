import { randomUUID } from "crypto";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IReviewRepository } from "../../domain/repositories/IReview.repository";
import { CreateReviewRequestDto } from "../dtos/request/create-review.request.dto";
import { ReviewResponseDto } from "../dtos/response/review-response.dto";
import { ReviewMapper } from "../mappers/review.mapper";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export class CreateReviewUseCase implements IUseCase<CreateReviewRequestDto, ReviewResponseDto> {
  constructor(
    private readonly _reviewRepo: IReviewRepository,
    private readonly _notificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
  ) {}

  async execute(input: CreateReviewRequestDto): Promise<ReviewResponseDto> {
    if (!input.bookingId) {
      throw new ApplicationError("MISSING_BOOKING_ID", "Booking ID is required", "VALIDATION");
    }
    if (!input.rating || input.rating < 1 || input.rating > 5) {
      throw new ApplicationError("INVALID_RATING", "Rating must be an integer between 1 and 5", "VALIDATION");
    }
    if (!input.comment || !input.comment.trim()) {
      throw new ApplicationError("MISSING_COMMENT", "Review comment cannot be empty", "VALIDATION");
    }

    const booking = await this._reviewRepo.findBookingEligibility(input.bookingId);
    if (!booking) {
      throw new ApplicationError("BOOKING_NOT_FOUND", "Associated booking not found", "NOT_FOUND");
    }

    if (booking.customerId !== input.customerId) {
      throw new ApplicationError("FORBIDDEN_REVIEW", "You can only review bookings made by your account", "AUTHORIZATION");
    }

    if (booking.status !== "COMPLETED") {
      throw new ApplicationError("BOOKING_NOT_COMPLETED", "Only completed bookings can be reviewed", "PRECONDITION");
    }

    const existingReview = await this._reviewRepo.findByBookingId(input.bookingId);
    if (existingReview) {
      throw new ApplicationError("REVIEW_ALREADY_EXISTS", "A review has already been submitted for this booking", "CONFLICT");
    }

    const reviewId = randomUUID();
    const createdReview = await this._reviewRepo.createReview({
      id: reviewId,
      bookingId: input.bookingId,
      customerId: input.customerId,
      providerId: booking.providerId,
      rating: Math.floor(input.rating),
      title: input.title ? input.title.trim() : null,
      comment: input.comment.trim(),
      aspectRatings: input.aspectRatings || null
    });

    if (this._notificationUseCase && booking.providerUserId) {
      try {
        const customerDisplayName = booking.customerName || "A customer";
        await this._notificationUseCase.execute({
          recipientId: booking.providerUserId,
          type: "REVIEW_RECEIVED",
          title_code: "REVIEW_RECEIVED",
          title: "New Review Received",
          message: `${customerDisplayName} left a ${createdReview.rating}-star review for booking #${booking.bookingNumber}.`
        });
      } catch {}
    }

    return ReviewMapper.toDto(createdReview);
  }
}
