import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import {
    GetAdminServiceRequestsInputDto,
    GetAdminRequestsOutputDto
} from "../dtos/response/service-request.dto";

export class GetAdminServiceRequestsUseCase implements IUseCase<GetAdminServiceRequestsInputDto, GetAdminRequestsOutputDto> {
    constructor(
        private readonly _serviceRequestRepository: IServiceRequestRepository
    ) {}

    async execute(input: GetAdminServiceRequestsInputDto): Promise<GetAdminRequestsOutputDto> {
        const page = input.page || 1;
        const limit = input.limit || 10;

        const response = await this._serviceRequestRepository.findAdminRequests({
            ...input,
            page,
            limit
        });

        const totalPages = Math.ceil(response.total / limit);
        return {
            requests: response.requests,
            total: response.total,
            totalPages,
            page,
            limit,
            counts: response.counts
        };
    }
}

