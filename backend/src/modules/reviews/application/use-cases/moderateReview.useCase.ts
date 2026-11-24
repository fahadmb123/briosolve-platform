import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IReviewRepository } from "../../domain/repositories/IReview.repository";
import { ModerateReviewRequestDto } from "../dtos/request/moderate-review.request.dto";
import { ReviewResponseDto } from "../dtos/response/review-response.dto";
import { ReviewMapper } from "../mappers/review.mapper";

export class ModerateReviewUseCase implements IUseCase<ModerateReviewRequestDto, ReviewResponseDto> {
  constructor(private readonly _reviewRepo: IReviewRepository) {}

  async execute(input: ModerateReviewRequestDto): Promise<ReviewResponseDto> {
    if (!input.reviewId) {
      throw new ApplicationError("MISSING_REVIEW_ID", "Review ID is required", "VALIDATION");
    }

    const existing = await this._reviewRepo.findById(input.reviewId);
    if (!existing) {
      throw new ApplicationError("REVIEW_NOT_FOUND", "Review not found", "NOT_FOUND");
    }

    const updated = await this._reviewRepo.updateModeration(input.reviewId, {
      isHidden: input.isHidden,
      isReported: input.isReported
    });

    if (!updated) {
      throw new ApplicationError("MODERATION_FAILED", "Failed to update review moderation status", "INTERNAL");
    }

    return ReviewMapper.toDto(updated);
  }
}
