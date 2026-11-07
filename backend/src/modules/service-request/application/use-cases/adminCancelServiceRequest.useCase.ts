import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { ApplicationError } from "../../../../shared/errors/applicationError";

export class AdminCancelServiceRequestUseCase implements IUseCase<string, void> {
    constructor(
        private readonly _serviceRequestRepository: IServiceRequestRepository
    ) {}

    async execute(id: string): Promise<void> {
        if (!id) {
            throw new ApplicationError("BAD_REQUEST", "Service request ID is required", "VALIDATION");
        }

        const cancelled = await this._serviceRequestRepository.adminCancel(id);
        if (!cancelled) {
            throw new ApplicationError("NOT_FOUND", "Service request not found", "NOT_FOUND");
        }
    }
}
