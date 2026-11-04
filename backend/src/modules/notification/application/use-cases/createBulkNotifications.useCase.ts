import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { INotificationRepository } from "../../domain/repositories/INotification.repository";
import { NotificationMapper } from "../../infrastructure/mappers/notification.mapper";
import { CreateBulkNotificationRequestDto } from "../dtos/request/create-bulk-notifications.dto";
import { CreateNotificationRequestDto } from "../dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../dtos/response/notification-response.dto";
import { INotificationDelivery } from "../interfaces/INotificationDelivery";


export class CreateBulkNotificationsUseCase implements IUseCase<CreateBulkNotificationRequestDto,NotificationResponseDto[]>{
    constructor(
        private readonly _notificationRepository: INotificationRepository,
        private readonly _notificationDelivery: INotificationDelivery,
    ) {}

    async execute(data: CreateBulkNotificationRequestDto): Promise<NotificationResponseDto[]> {

        const notificationInputs: CreateNotificationRequestDto[] =
            data.recipientIds.map(recipientId => ({
                recipientId: recipientId,
                title: data.title,
                title_code: data.title_code,
                message: data.message,
                type: data.type,
            }))

        const notifications = await this._notificationRepository.createMany(notificationInputs)

        if (!notifications) throw new ApplicationError("FAILED_TO_CREATE_DATA","Failed To Create Data","INTERNAL")

        const response = notifications.map(notification =>
            NotificationMapper.toDto(notification),
        );

        await Promise.all(
            response.map(notification =>
                this._notificationDelivery.deliver(notification),
            ),
        );

        return response
    }
}