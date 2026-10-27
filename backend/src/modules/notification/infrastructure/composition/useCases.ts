import { CreateNotificationUseCase } from "../../application/use-cases/createNotification.usecase";
import { notificastionRepository } from "./repositories";


export const createNotificationUsecase = new CreateNotificationUseCase(
    notificastionRepository
)