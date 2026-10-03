import { ApplicationError } from "../../../../../shared/application/errors/applicationError.js";
import { IPendingRegistrationStore } from "../../../../../shared/domain/interfaces/IPendingRegistration-store.js";
import { IPasswordHasher } from "../../../../../shared/domain/interfaces/IPasswordHasher.service.js";
import type { IOtpGenerator } from "../../../../../shared/domain/interfaces/IOtpGenerator.service.js";
import type { IEmailSender } from "../../../../../shared/domain/interfaces/IEmailSender.service.js";
import { IUseCase } from "../../../domain/interfaces/use-cases/IUseCase.js";

export type ResendOtpOutput = {
    expiresIn: number;
}

export default class ResendOtpUseCase implements IUseCase<string, ResendOtpOutput> {
    constructor(
        private readonly pendingRegistrationStore: IPendingRegistrationStore,
        private readonly passwordHasher: IPasswordHasher,
        private readonly otpGenerate: IOtpGenerator,
        private readonly emailSender: IEmailSender
    ) {}

    async execute(registrationId: string): Promise<ResendOtpOutput> {
        if (!registrationId) {
            throw new ApplicationError("REGISTRATION_EXPIRED", "Registration session expired", "AUTHENTICATION");
        }

        const data = await this.pendingRegistrationStore.get(registrationId);
        
        if (!data) {
            throw new ApplicationError("REGISTRATION_EXPIRED", "Registration session expired", "AUTHENTICATION");
        }

        if (data.attempts >= 5) {
            throw new ApplicationError("MAX_ATTEMPTS", "Maximum attempts reached", "AUTHENTICATION");
        }

        const otp = this.otpGenerate.generate();
        const otpHash = await this.passwordHasher.hash(otp);
        const otpExpiresIn = 60;
        const otpExpiresAt = Date.now() + otpExpiresIn * 1000;

        data.otpHash = otpHash;
        data.attempts += 1;
        data.otpExpiresAt = otpExpiresAt;

        await this.pendingRegistrationStore.update(registrationId, data);
        await this.emailSender.sendOtp(data.email, otp);

        return { expiresIn: otpExpiresIn };
    }
}
