import { randomUUID } from "crypto";
import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IPasswordHasher } from "../../../../../shared/application/interfaces/services/IPasswordHasher.service";
import type { IOtpGenerator } from "../../../../../shared/application/interfaces/services/IOtpGenerator.service";
import type { IEmailSender } from "../../../../../shared/application/interfaces/services/IEmailSender.service";
import type { IPendingRegistrationStore } from "../../../../../shared/application/interfaces/IPendingRegistration-store";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";

export class SendBecomeCustomerOtpUseCase implements IUseCase<string,{ registrationId: string; expiresIn: number }>{
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _passwordHasher: IPasswordHasher,
        private readonly _otpGenerate: IOtpGenerator,
        private readonly _emailSender: IEmailSender,
        private readonly _pendingRegistrationStore: IPendingRegistrationStore
    ) {}

    async execute(userId: string): Promise<{ registrationId: string; expiresIn: number }> {
        const user = await this._userRepository.findById(userId);
        if (!user) throw new ApplicationError("NOT_FOUND", "User not found", "NOT_FOUND");

        if (user.role !== "PROVIDER") throw new ApplicationError("BAD_REQUEST", "Only providers can become customers", "CONFLICT")

        const otp = this._otpGenerate.generate();
        const otpHash = await this._passwordHasher.hash(otp);
        const registrationId = randomUUID();
        const otpExpiresIn = 60;
        const otpExpiresAt = Date.now() + otpExpiresIn * 1000;
        const registrationTtl = 10 * 60;
        console.log("OTP : ",otp)
        await this._pendingRegistrationStore.save(registrationId, {
            name: user.name,
            email: user.email,
            otpHash,
            attempts: 0,
            path: "settings",
            otpExpiresAt,
            for: "BECOME_CUSTOMER",
            userId: user.id
        }, registrationTtl);

        await this._emailSender.sendOtp(user.email, otp);

        return { registrationId, expiresIn: otpExpiresIn };
    }
}
