import { randomUUID } from "crypto";
import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IUserAccountBlockRepository } from "../../../domain/repositories/IUserAccountBlockRepository";
import { IAccountReactivationRequestRepository } from "../../../domain/repositories/IAccountReactivationRequestRepository";
import { IPasswordHasher } from "../../../../../shared/application/interfaces/services/IPasswordHasher.service";
import type { IOtpGenerator } from "../../../../../shared/application/interfaces/services/IOtpGenerator.service";
import type { IEmailSender } from "../../../../../shared/application/interfaces/services/IEmailSender.service";
import type { IPendingRegistrationStore } from "../../../../../shared/application/interfaces/IPendingRegistration-store";

export type SendReactivationOtpDto = {
    email: string;
};

export class SendReactivationOtpUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _userAccountBlockRepository: IUserAccountBlockRepository,
        private readonly _reactivationRequestRepository: IAccountReactivationRequestRepository,
        private readonly _passwordHasher: IPasswordHasher,
        private readonly _otpGenerate: IOtpGenerator,
        private readonly _emailSender: IEmailSender,
        private readonly _pendingRegistrationStore: IPendingRegistrationStore
    ) {}

    async execute(input: SendReactivationOtpDto): Promise<{ registrationId: string; expiresIn: number }> {
        const email = input.email?.trim().toLowerCase();

        if (!email) throw new ApplicationError("BAD_REQUEST", "Email address is required", "VALIDATION");

        const user = await this._userRepository.findByEmail(email);
        if (!user) throw new ApplicationError("NOT_FOUND", "No account found with this email address", "NOT_FOUND");

        if (user.status !== "BLOCKED") {
            throw new ApplicationError("BAD_REQUEST", "This account is currently active and not suspended", "CONFLICT");
        }

        const block = await this._userAccountBlockRepository.findByUserId(user.id);
        if (!block) {
            throw new ApplicationError("NOT_FOUND", "No active suspension record found for this account", "NOT_FOUND");
        }

        const pending = await this._reactivationRequestRepository.findPendingByUserId(user.id);
        if (pending) {
            throw new ApplicationError("CONFLICT", "A reactivation request is already under review for this account", "CONFLICT");
        }

        const otp = this._otpGenerate.generate();
        const otpHash = await this._passwordHasher.hash(otp);
        const registrationId = randomUUID();
        const otpExpiresIn = 60;
        const otpExpiresAt = Date.now() + otpExpiresIn * 1000;
        const registrationTtl = 10 * 60;

        await this._pendingRegistrationStore.save(registrationId, {
            name: user.name,
            email: user.email,
            otpHash,
            attempts: 0,
            path: "account/request",
            otpExpiresAt,
            for: "REACTIVATE_ACCOUNT",
            userId: user.id
        }, registrationTtl);

        await this._emailSender.sendOtp(user.email, otp);

        return { registrationId, expiresIn: otpExpiresIn };
    }
}
