import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUserAccountBlockRepository } from "../../domain/repositories/IUserAccountBlockRepository";
import { IAccountReactivationRequestRepository } from "../../domain/repositories/IAccountReactivationRequestRepository";
import { AccountReactivationRequest } from "../../domain/entities/accountReactivationRequest.entity";
import { IEmailSender } from "../../../../shared/domain/interfaces/IEmailSender.service";
import type { IPendingRegistrationStore } from "../../../../shared/domain/interfaces/IPendingRegistration-store";

export type RequestReactivationDto = {
    email: string;
    reason: string;
    registrationId?: string;
};

export class CreateAccountReactivationRequestUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly userAccountBlockRepository: IUserAccountBlockRepository,
        private readonly reactivationRequestRepository: IAccountReactivationRequestRepository,
        private readonly emailSender: IEmailSender,
        private readonly pendingRegistrationStore: IPendingRegistrationStore
    ) {}

    async execute(input: RequestReactivationDto): Promise<AccountReactivationRequest> {
        const email = input.email?.trim().toLowerCase();
        const reason = input.reason?.trim();

        if (!email) throw new ApplicationError("BAD_REQUEST", "Email address is required", "VALIDATION");
        if (!reason || reason.length < 10) throw new ApplicationError("BAD_REQUEST", "Please provide a detailed explanation (minimum 10 characters)", "VALIDATION");

        if (!input.registrationId) {
            throw new ApplicationError("UNAUTHORIZED", "Verification session expired. Please verify your email again.", "AUTHENTICATION");
        }

        const session = await this.pendingRegistrationStore.get(input.registrationId);
        if (!session || session.for !== "REACTIVATE_ACCOUNT" || !(session as any).isVerified) {
            throw new ApplicationError("UNAUTHORIZED", "Please verify your email before submitting the request", "AUTHENTICATION");
        }

        if (session.email.toLowerCase() !== email) {
            throw new ApplicationError("BAD_REQUEST", "Submitted email does not match verified email", "VALIDATION");
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new ApplicationError("NOT_FOUND", "No account found with this email address", "NOT_FOUND");

        if (user.status !== "BLOCKED") {
            throw new ApplicationError("BAD_REQUEST", "This account is currently active and not suspended", "CONFLICT");
        }

        const block = await this.userAccountBlockRepository.findByUserId(user.id);
        if (!block) {
            throw new ApplicationError("NOT_FOUND", "No active suspension record found for this account", "NOT_FOUND");
        }

        const pending = await this.reactivationRequestRepository.findPendingByUserId(user.id);
        if (pending) {
            throw new ApplicationError("CONFLICT", "A reactivation request is already under review for this account", "CONFLICT");
        }

        await this.pendingRegistrationStore.delete(input.registrationId);
        await this.emailSender.sendSubmitRequest(user.email);

        return await this.reactivationRequestRepository.create({
            user_id: user.id,
            block_id: block.id,
            reason
        });
    }
}
