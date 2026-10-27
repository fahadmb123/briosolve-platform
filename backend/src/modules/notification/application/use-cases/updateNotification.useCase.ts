import { INotificationRepository } from "../../domain/repositories/INotification.repository";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { IUserRepository } from "../../../auth/public";
import { UpdateNotificationRequestDto } from "../dtos/request/update-notificsation.dto";


export class UpdateNotificationUseCase implements IUseCase<UpdateNotificationRequestDto,void>{
    constructor(
        private readonly _notificationRepository: INotificationRepository,
        private readonly _userRepository: IUserRepository,
    ) {}

    async execute(data:UpdateNotificationRequestDto): Promise<void> {
        const user = await this._userRepository.findById(data.recipientId)

        if (!user){
            throw new ApplicationError(
                "USER_NOT_FOUND",
                "User Not Found",
                "NOT_FOUND"
            )
        }

        const notification = await this._notificationRepository.findById(data.id)

        if (!notification) {
            throw new ApplicationError(
                "NOT_FOUND",
                "Not Found",
                "NOT_FOUND"
            )
        }

        await this._notificationRepository.update(
            data.id,
            data.input
        )
    }
}