import { IPushSubscriptionRepository } from "../../domain/repositories/IPushSubscription.respository";
import { IUserRepository } from "../../../auth/public";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { SavePushSubscriptionRequestDto } from "../dtos/request/save-push-subscription.dto";

export class SavePushSubscriptionUseCase implements IUseCase<SavePushSubscriptionRequestDto, void> {
    constructor(
        private readonly _pushSubscriptionRepository: IPushSubscriptionRepository,
        private readonly _userRepository: IUserRepository,
    ) {}

    async execute(data: SavePushSubscriptionRequestDto): Promise<void> {
        const user = await this._userRepository.findById(data.userId);

        if (!user) {
            throw new ApplicationError(
                "USER_NOT_FOUND",
                "User Not Found",
                "NOT_FOUND"
            );
        }

        await this._pushSubscriptionRepository.saveSubscription({
            userId: data.userId,
            endpoint: data.endpoint,
            p256dh: data.p256dh,
            auth: data.auth,
        });
    }
}

