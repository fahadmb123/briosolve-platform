import { INotificationRepository } from "../../domain/repositories/INotification.repository";
import { NotificationResponseDto } from "../dtos/response/notification-response.dto";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { NotificationMapper } from "../../infrastructure/mappers/notification.mapper";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { GetNotificationRequestDto } from "../dtos/request/get-notifications.dto";


export class GetNotificationsUseCase implements IUseCase<GetNotificationRequestDto,NotificationResponseDto[]>{
    constructor(
        private readonly _notificationRepository: INotificationRepository,
    ) {}

    async execute(data:GetNotificationRequestDto): Promise<NotificationResponseDto[]> {
        const notifications = await this._notificationRepository.findByRecipientId(data.recipientId)

        if (!notifications) {
            throw new ApplicationError(
                "DATABASE_FAILED",
                "Database Failed",
                "INTERNAL",
            );
        }

        return notifications.map((notification)=>{
            return NotificationMapper.toDto(notification)
        })
    }
}