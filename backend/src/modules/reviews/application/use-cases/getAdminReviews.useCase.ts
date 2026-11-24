import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IReviewRepository } from "../../domain/repositories/IReview.repository";
import { GetAdminReviewsRequestDto } from "../dtos/request/get-admin-reviews.request.dto";
import { AdminReviewsResponseDto } from "../dtos/response/admin-reviews-response.dto";
import { ReviewMapper } from "../../infrastructure/mappers/review.mapper";

export class GetAdminReviewsUseCase implements IUseCase<GetAdminReviewsRequestDto, AdminReviewsResponseDto> {
  constructor(private readonly _reviewRepo: IReviewRepository) {}

  async execute(input: GetAdminReviewsRequestDto): Promise<AdminReviewsResponseDto> {
    const page = input.page && input.page > 0 ? input.page : 1;
    const limit = input.limit && input.limit > 0 ? input.limit : 20;

    const result = await this._reviewRepo.findAdminReviews({
      search: input.search,
      rating: input.rating,
      isReported: input.isReported,
      isHidden: input.isHidden,
      page,
      limit
    });

    const totalPages = Math.ceil(result.total / limit) || 1;

    return {
      reviews: result.reviews.map(ReviewMapper.toDto),
      reportedCount: result.reportedCount,
      pagination: {
        page,
        limit,
        totalPages,
        total: result.total
      }
    };
  }
}
