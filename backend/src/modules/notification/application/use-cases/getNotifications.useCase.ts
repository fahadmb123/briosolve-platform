import { INotificationRepository } from "../../domain/repositories/INotification.repository";
import { NotificationResponseDto } from "../dtos/response/notification-response.dto";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { NotificationMapper } from "../mappers/notification.mapper";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import {
    GetNotificationRequestDto,
    PaginatedNotificationsResponseDto
} from "../dtos/request/get-notifications.dto";
import { IUserRepository } from "../../../auth/public";

export class GetNotificationsUseCase implements IUseCase<GetNotificationRequestDto, PaginatedNotificationsResponseDto | NotificationResponseDto[]> {
    constructor(
        private readonly _notificationRepository: INotificationRepository,
        private readonly _userRepository: IUserRepository,
    ) {}

    async execute(data: GetNotificationRequestDto): Promise<PaginatedNotificationsResponseDto | NotificationResponseDto[]> {
        const user = await this._userRepository.findById(data.recipientId);

        if (!user) {
            throw new ApplicationError(
                "USER_NOT_FOUND",
                "User Not Found",
                "NOT_FOUND"
            );
        }

        if (data.page !== undefined || data.limit !== undefined) {
            const page = Math.max(1, data.page || 1);
            const limit = Math.max(1, data.limit || 5);
            const result = await this._notificationRepository.findPaginatedByRecipientId(data.recipientId, {
                page,
                limit,
                unreadOnly: data.unreadOnly
            });

            return {
                notifications: result.notifications.map((n) => NotificationMapper.toDto(n)),
                total: result.total,
                totalPages: result.totalPages,
                page,
                limit
            };
        }

        const notifications = await this._notificationRepository.findByRecipientId(data.recipientId, {
            unreadOnly: data.unreadOnly
        });

        if (!notifications) {
            throw new ApplicationError(
                "DATABASE_FAILED",
                "Database Failed",
                "INTERNAL",
            );
        }

        return notifications.map((notification) => {
            return NotificationMapper.toDto(notification);
        });
    }
}
