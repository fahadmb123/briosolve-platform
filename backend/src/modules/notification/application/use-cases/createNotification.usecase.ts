import { INotificationRepository } from "../../domain/repositories/INotification.repository";
import { CreateNotificationRequestDto } from "../dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../dtos/response/notification-response.dto";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { NotificationMapper } from "../../infrastructure/mappers/notification.mapper";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { INotificationDelivery } from "../interfaces/INotificationDelivery";


export class CreateNotificationUseCase implements IUseCase<CreateNotificationRequestDto,NotificationResponseDto>{
    constructor(
        private readonly _notificationRepository: INotificationRepository,
        private readonly _notificationDelivery: INotificationDelivery,
    ) {}

    async execute(data: CreateNotificationRequestDto): Promise<NotificationResponseDto> {
        const notification = await this._notificationRepository.create(data)

        if (!notification) {
            throw new ApplicationError(
                "CREATION_FAILED",
                "Creation Failed",
                "INTERNAL",
            );
        }

        const response = NotificationMapper.toDto(notification)

        this._notificationDelivery.deliver(response)

        return response
    }
}