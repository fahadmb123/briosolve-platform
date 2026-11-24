import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IReviewRepository } from "../../domain/repositories/IReview.repository";
import { GetProviderReviewsRequestDto } from "../dtos/request/get-provider-reviews.request.dto";
import { ProviderReviewsSummaryResponseDto } from "../dtos/response/provider-reviews-summary-response.dto";
import { ReviewMapper } from "../../infrastructure/mappers/review.mapper";
import { ReviewRatingService } from "../services/review-rating.service";

export class GetProviderReviewsUseCase implements IUseCase<GetProviderReviewsRequestDto, ProviderReviewsSummaryResponseDto> {
  constructor(private readonly _reviewRepo: IReviewRepository) {}

  async execute(input: GetProviderReviewsRequestDto): Promise<ProviderReviewsSummaryResponseDto> {
    if (!input.providerId) {
      throw new ApplicationError("MISSING_PROVIDER_ID", "Provider ID is required", "VALIDATION");
    }

    const page = input.page && input.page > 0 ? input.page : 1;
    const limit = input.limit && input.limit > 0 ? input.limit : 10;

    const result = await this._reviewRepo.findProviderReviews({
      providerId: input.providerId,
      rating: input.rating,
      page,
      limit,
      includeHidden: input.includeHidden
    });

    const breakdown = ReviewRatingService.buildBreakdown(result.ratingCounts, result.total);
    const totalPages = Math.ceil(result.total / limit) || 1;

    return {
      providerId: input.providerId,
      averageRating: result.averageRating,
      totalReviews: result.total,
      breakdown,
      reviews: result.reviews.map(ReviewMapper.toDto),
      pagination: {
        page,
        limit,
        totalPages,
        total: result.total
      }
    };
  }
}
