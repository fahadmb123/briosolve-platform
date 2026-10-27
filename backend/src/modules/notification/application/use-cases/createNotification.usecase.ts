import { INotificationRepository } from "../../domain/repositories/INotification.repository";
import { CreateNotificationRequestDto } from "../dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../dtos/response/notification-response.dto";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { NotificationMapper } from "../../infrastructure/mappers/notification.mapper";


export class CreateNotificationUseCase {
    constructor(
        private readonly notificationRepository: INotificationRepository,
    ) {}

    async execute(data: CreateNotificationRequestDto): Promise<NotificationResponseDto> {
        const notification = await this.notificationRepository.create(data)

        if (!notification) {
            throw new ApplicationError(
                "CREATION_FAILED",
                "Creation Failed",
                "INTERNAL",
            );
        }

        return NotificationMapper.toDto(notification)
    }
}