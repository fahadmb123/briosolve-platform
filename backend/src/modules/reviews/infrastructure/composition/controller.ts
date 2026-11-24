import { ReviewController } from "../../presentation/controllers/review.controller";
import { CreateReviewUseCase } from "../../application/use-cases/createReview.useCase";
import { GetProviderReviewsUseCase } from "../../application/use-cases/getProviderReviews.useCase";
import { GetCustomerReviewsUseCase } from "../../application/use-cases/getCustomerReviews.useCase";
import { ReplyToReviewUseCase } from "../../application/use-cases/replyToReview.useCase";
import { GetAdminReviewsUseCase } from "../../application/use-cases/getAdminReviews.useCase";
import { ModerateReviewUseCase } from "../../application/use-cases/moderateReview.useCase";

export function createReviewController(
  createReviewUC: CreateReviewUseCase,
  getProviderReviewsUC: GetProviderReviewsUseCase,
  getCustomerReviewsUC: GetCustomerReviewsUseCase,
  replyToReviewUC: ReplyToReviewUseCase,
  getAdminReviewsUC: GetAdminReviewsUseCase,
  moderateReviewUC: ModerateReviewUseCase
): ReviewController {
  return new ReviewController(
    createReviewUC,
    getProviderReviewsUC,
    getCustomerReviewsUC,
    replyToReviewUC,
    getAdminReviewsUC,
    moderateReviewUC
  );
}
