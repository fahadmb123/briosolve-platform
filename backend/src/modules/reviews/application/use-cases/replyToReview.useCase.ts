import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IReviewRepository } from "../../domain/repositories/IReview.repository";
import { ReplyReviewRequestDto } from "../dtos/request/reply-review.request.dto";
import { ReviewResponseDto } from "../dtos/response/review-response.dto";
import { ReviewMapper } from "../../infrastructure/mappers/review.mapper";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export class ReplyToReviewUseCase implements IUseCase<ReplyReviewRequestDto, ReviewResponseDto> {
  constructor(
    private readonly _reviewRepo: IReviewRepository,
    private readonly _notificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
  ) {}

  async execute(input: ReplyReviewRequestDto): Promise<ReviewResponseDto> {
    if (!input.reviewId) {
      throw new ApplicationError("MISSING_REVIEW_ID", "Review ID is required", "VALIDATION");
    }
    if (!input.replyText || !input.replyText.trim()) {
      throw new ApplicationError("MISSING_REPLY_TEXT", "Reply text cannot be empty", "VALIDATION");
    }

    const existing = await this._reviewRepo.findById(input.reviewId);
    if (!existing) {
      throw new ApplicationError("REVIEW_NOT_FOUND", "Review not found", "NOT_FOUND");
    }

    const updated = await this._reviewRepo.replyToReview(input.reviewId, input.replyText.trim());
    if (!updated) {
      throw new ApplicationError("REPLY_FAILED", "Failed to record reply to review", "INTERNAL");
    }

    if (this._notificationUseCase && existing.customerId) {
      try {
        await this._notificationUseCase.execute({
          recipientId: existing.customerId,
          type: "REVIEW_REPLIED",
          title_code: "REVIEW_REPLIED",
          title: "Provider Replied to Your Review",
          message: "The service provider has posted a public response to your review."
        });
      } catch {}
    }

    return ReviewMapper.toDto(updated);
  }
}
