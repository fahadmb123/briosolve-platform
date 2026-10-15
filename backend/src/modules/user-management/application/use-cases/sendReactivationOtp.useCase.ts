import { randomUUID } from "crypto";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUserAccountBlockRepository } from "../../domain/repositories/IUserAccountBlockRepository";
import { IAccountReactivationRequestRepository } from "../../domain/repositories/IAccountReactivationRequestRepository";
import { IPasswordHasher } from "../../../../shared/domain/interfaces/IPasswordHasher.service";
import type { IOtpGenerator } from "../../../../shared/domain/interfaces/IOtpGenerator.service";
import type { IEmailSender } from "../../../../shared/domain/interfaces/IEmailSender.service";
import type { IPendingRegistrationStore } from "../../../../shared/domain/interfaces/IPendingRegistration-store";

export type SendReactivationOtpDto = {
    email: string;
};

export class SendReactivationOtpUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly userAccountBlockRepository: IUserAccountBlockRepository,
        private readonly reactivationRequestRepository: IAccountReactivationRequestRepository,
        private readonly passwordHasher: IPasswordHasher,
        private readonly otpGenerate: IOtpGenerator,
        private readonly emailSender: IEmailSender,
        private readonly pendingRegistrationStore: IPendingRegistrationStore
    ) {}

    async execute(input: SendReactivationOtpDto): Promise<{ registrationId: string; expiresIn: number }> {
        const email = input.email?.trim().toLowerCase();

        if (!email) throw new ApplicationError("BAD_REQUEST", "Email address is required", "VALIDATION");

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

        const otp = this.otpGenerate.generate();
        const otpHash = await this.passwordHasher.hash(otp);
        const registrationId = randomUUID();
        const otpExpiresIn = 60;
        const otpExpiresAt = Date.now() + otpExpiresIn * 1000;
        const registrationTtl = 10 * 60;

        await this.pendingRegistrationStore.save(registrationId, {
            name: user.name,
            email: user.email,
            otpHash,
            attempts: 0,
            path: "account/request",
            otpExpiresAt,
            for: "REACTIVATE_ACCOUNT",
            userId: user.id
        }, registrationTtl);

        await this.emailSender.sendOtp(user.email, otp);

        return { registrationId, expiresIn: otpExpiresIn };
    }
}
