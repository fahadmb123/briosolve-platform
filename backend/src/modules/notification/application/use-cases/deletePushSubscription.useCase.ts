import { IPushSubscriptionRepository } from "../../domain/repositories/IPushSubscription.respository";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { DeletePushSubscriptionRequestDto } from "../dtos/request/delete-push-subscription.dto";

export class DeletePushSubscriptionUseCase implements IUseCase<DeletePushSubscriptionRequestDto, void> {
    constructor(
        private readonly _pushSubscriptionRepository: IPushSubscriptionRepository,
    ) {}

    async execute(data: DeletePushSubscriptionRequestDto): Promise<void> {
        await this._pushSubscriptionRepository.deleteByEndpoint(data.endpoint);
    }
}

