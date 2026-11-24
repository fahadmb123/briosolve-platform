import { IReviewRepository } from "../../domain/repositories/IReview.repository";
import { CreateReviewUseCase } from "../../application/use-cases/createReview.useCase";
import { GetProviderReviewsUseCase } from "../../application/use-cases/getProviderReviews.useCase";
import { GetCustomerReviewsUseCase } from "../../application/use-cases/getCustomerReviews.useCase";
import { ReplyToReviewUseCase } from "../../application/use-cases/replyToReview.useCase";
import { GetAdminReviewsUseCase } from "../../application/use-cases/getAdminReviews.useCase";
import { ModerateReviewUseCase } from "../../application/use-cases/moderateReview.useCase";
import { GetBookingReviewUseCase } from "../../application/use-cases/getBookingReview.useCase";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export function createReviewUseCase(
  repo: IReviewRepository,
  notificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): CreateReviewUseCase {
  return new CreateReviewUseCase(repo, notificationUseCase);
}

export function createGetProviderReviewsUseCase(repo: IReviewRepository): GetProviderReviewsUseCase {
  return new GetProviderReviewsUseCase(repo);
}

export function createGetCustomerReviewsUseCase(repo: IReviewRepository): GetCustomerReviewsUseCase {
  return new GetCustomerReviewsUseCase(repo);
}

export function createReplyToReviewUseCase(
  repo: IReviewRepository,
  notificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): ReplyToReviewUseCase {
  return new ReplyToReviewUseCase(repo, notificationUseCase);
}

export function createGetAdminReviewsUseCase(repo: IReviewRepository): GetAdminReviewsUseCase {
  return new GetAdminReviewsUseCase(repo);
}

export function createModerateReviewUseCase(repo: IReviewRepository): ModerateReviewUseCase {
  return new ModerateReviewUseCase(repo);
}

export function createGetBookingReviewUseCase(repo: IReviewRepository): GetBookingReviewUseCase {
  return new GetBookingReviewUseCase(repo);
}
