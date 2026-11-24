import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IReviewRepository } from "../../domain/repositories/IReview.repository";
import { GetCustomerReviewsRequestDto } from "../dtos/request/get-customer-reviews.request.dto";
import { CustomerReviewsResponseDto } from "../dtos/response/customer-reviews-response.dto";
import { ReviewMapper } from "../../infrastructure/mappers/review.mapper";

export class GetCustomerReviewsUseCase implements IUseCase<GetCustomerReviewsRequestDto, CustomerReviewsResponseDto> {
  constructor(private readonly _reviewRepo: IReviewRepository) {}

  async execute(input: GetCustomerReviewsRequestDto): Promise<CustomerReviewsResponseDto> {
    if (!input.customerId) {
      throw new ApplicationError("MISSING_CUSTOMER_ID", "Customer ID is required", "VALIDATION");
    }

    const page = input.page && input.page > 0 ? input.page : 1;
    const limit = input.limit && input.limit > 0 ? input.limit : 10;

    const result = await this._reviewRepo.findCustomerReviews({
      customerId: input.customerId,
      page,
      limit
    });

    const totalPages = Math.ceil(result.total / limit) || 1;

    return {
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
