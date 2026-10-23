import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IPendingRegistrationStore } from "../../../../../shared/application/interfaces/IPendingRegistration-store";
import { IPasswordHasher } from "../../../../../shared/application/interfaces/services/IPasswordHasher.service";
import type { IOtpGenerator } from "../../../../../shared/application/interfaces/services/IOtpGenerator.service";
import type { IEmailSender } from "../../../../../shared/application/interfaces/services/IEmailSender.service";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";

export type ResendOtpOutput = {
    expiresIn: number;
}

export default class ResendOtpUseCase implements IUseCase<string, ResendOtpOutput> {
    constructor(
        private readonly _pendingRegistrationStore: IPendingRegistrationStore,
        private readonly _passwordHasher: IPasswordHasher,
        private readonly _otpGenerate: IOtpGenerator,
        private readonly _emailSender: IEmailSender
    ) {}

    async execute(registrationId: string): Promise<ResendOtpOutput> {
        if (!registrationId) {
            throw new ApplicationError("REGISTRATION_EXPIRED", "Registration session expired", "AUTHENTICATION");
        }

        const data = await this._pendingRegistrationStore.get(registrationId);
        
        if (!data) {
            throw new ApplicationError("REGISTRATION_EXPIRED", "Registration session expired", "AUTHENTICATION");
        }

        if (data.attempts >= 5) {
            throw new ApplicationError("MAX_ATTEMPTS", "Maximum attempts reached", "AUTHENTICATION");
        }

        const otp = this._otpGenerate.generate();
        const otpHash = await this._passwordHasher.hash(otp);
        const otpExpiresIn = 60;
        const otpExpiresAt = Date.now() + otpExpiresIn * 1000;

        data.otpHash = otpHash;
        data.attempts += 1;
        data.otpExpiresAt = otpExpiresAt;

        await this._pendingRegistrationStore.update(registrationId, data);
        await this._emailSender.sendOtp(data.email, otp);

        return { expiresIn: otpExpiresIn };
    }
}
