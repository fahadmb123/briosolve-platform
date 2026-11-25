import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IReviewRepository } from "../../domain/repositories/IReview.repository";
import { ReviewResponseDto } from "../dtos/response/review-response.dto";
import { ReviewMapper } from "../mappers/review.mapper";

export class GetBookingReviewUseCase implements IUseCase<{ bookingId: string }, ReviewResponseDto | null> {
  constructor(private readonly _reviewRepo: IReviewRepository) {}

  async execute(input: { bookingId: string }): Promise<ReviewResponseDto | null> {
    const review = await this._reviewRepo.findByBookingId(input.bookingId);
    if (!review) {
      return null;
    }
    return ReviewMapper.toDto(review);
  }
}
