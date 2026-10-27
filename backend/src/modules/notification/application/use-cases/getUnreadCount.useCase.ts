import { INotificationRepository } from "../../domain/repositories/INotification.repository";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { IUserRepository } from "../../../auth/public";



export class GetUnreadCountUseCase implements IUseCase<string,number>{
    constructor(
        private readonly _notificationRepository: INotificationRepository,
        private readonly _userRepository: IUserRepository,
    ) {}

    async execute(userId:string): Promise<number> {
        const user = await this._userRepository.findById(userId)

        if (!user){
            throw new ApplicationError(
                "USER_NOT_FOUND",
                "User Not Found",
                "NOT_FOUND"
            )
        }

        const unreadCount = await this._notificationRepository.getUnreadCount(userId)

        return unreadCount
    }
}