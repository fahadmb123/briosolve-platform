import { INotificationRepository } from "../../domain/repositories/INotification.repository";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { IUserRepository } from "../../../auth/public";
import { NotificationMapper } from "../../infrastructure/mappers/notification.mapper";
import { NotificationResponseDto } from "../dtos/response/notification-response.dto";


export class MarkAllAsReadUseCase implements IUseCase<string,NotificationResponseDto[]>{
    constructor(
        private readonly _notificationRepository: INotificationRepository,
        private readonly _userRepository: IUserRepository,
    ) {}

    async execute(userId:string): Promise<NotificationResponseDto[]> {
        const user = await this._userRepository.findById(userId)

        if (!user){
            throw new ApplicationError(
                "USER_NOT_FOUND",
                "User Not Found",
                "NOT_FOUND"
            )
        }

        const notifications = await this._notificationRepository.markAllAsRead(userId)

        if (!notifications) {
            throw new ApplicationError(
                "FAILED_TO_UPDATE_ALL",
                "Failed To Update All",
                "INTERNAL"
            )
        }

        return notifications.map((notificastion)=>{
            return NotificationMapper.toDto(notificastion)
        })
    }
}