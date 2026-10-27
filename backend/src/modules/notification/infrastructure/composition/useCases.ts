import { CreateNotificationUseCase } from "../../application/use-cases/createNotification.usecase";
import { GetNotificationsUseCase } from "../../application/use-cases/getNotifications.useCase";
import { notificastionRepository, userRepository } from "./repositories";


export const createNotificationUsecase = new CreateNotificationUseCase(
    notificastionRepository
)
export const getNotificationsUseCase = new GetNotificationsUseCase(
    notificastionRepository,
    userRepository
)