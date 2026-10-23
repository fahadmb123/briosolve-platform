import { IAccountReactivationRequestRepository } from "../../../domain/repositories/IAccountReactivationRequestRepository";
import { AccountReactivationRequest } from "../../../domain/entities/accountReactivationRequest.entity";
import { GetReactivationsDto } from "../../dtos/request/suspend/get-reactivations.dto";


export class GetReactivationRequestsUseCase {
    constructor(
        private readonly _reactivationRepository: IAccountReactivationRequestRepository
    ) {}

    async execute(input: GetReactivationsDto): Promise<{ requests: AccountReactivationRequest[]; total: number; totalPages: number }> {
        const limit = input.limit || 10;
        const page = input.page || 1;

        const response = await this._reactivationRepository.getRequests({
            page,
            limit,
            search: input.search,
            filter: input.filter,
            role: input.role,
            sort: input.sort || "desc"
        });

        const totalPages = Math.ceil(response.total / limit) || 1;

        return {
            requests: response.requests,
            total: response.total,
            totalPages
        };
    }
}
