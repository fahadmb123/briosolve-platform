import { Router } from "express";
import { createReviewRepository } from "./repositories";
import {
  createReviewUseCase,
  createGetProviderReviewsUseCase,
  createGetCustomerReviewsUseCase,
  createReplyToReviewUseCase,
  createGetAdminReviewsUseCase,
  createModerateReviewUseCase,
  createGetBookingReviewUseCase
} from "./useCases";
import { createReviewController } from "./controller";
import { buildReviewRoute } from "../../presentation/routes/review.routes";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export function createReviewRoutes(
  notificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): Router {
  const repository = createReviewRepository();
  const createReviewUC = createReviewUseCase(repository, notificationUseCase);
  const getProviderReviewsUC = createGetProviderReviewsUseCase(repository);
  const getCustomerReviewsUC = createGetCustomerReviewsUseCase(repository);
  const replyToReviewUC = createReplyToReviewUseCase(repository, notificationUseCase);
  const getAdminReviewsUC = createGetAdminReviewsUseCase(repository);
  const moderateReviewUC = createModerateReviewUseCase(repository);
  const getBookingReviewUC = createGetBookingReviewUseCase(repository);

  const controller = createReviewController(
    createReviewUC,
    getProviderReviewsUC,
    getCustomerReviewsUC,
    replyToReviewUC,
    getAdminReviewsUC,
    moderateReviewUC,
    getBookingReviewUC
  );

  return buildReviewRoute({ review: controller });
}

export * from "./repositories";
export * from "./useCases";
export * from "./controller";
