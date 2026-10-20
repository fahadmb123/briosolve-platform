import { randomUUID } from "crypto";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IPasswordHasher } from "../../../../shared/domain/interfaces/services/IPasswordHasher.service";
import type { IOtpGenerator } from "../../../../shared/domain/interfaces/services/IOtpGenerator.service";
import type { IEmailSender } from "../../../../shared/domain/interfaces/services/IEmailSender.service";
import type { IPendingRegistrationStore } from "../../../../shared/domain/interfaces/IPendingRegistration-store";
import { IUseCase } from "../../../../shared/domain/interfaces/use-cases/IUseCase";

export class SendBecomeProviderOtpUseCase implements IUseCase<string,{ registrationId: string; expiresIn: number }>{
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: IPasswordHasher,
        private readonly otpGenerate: IOtpGenerator,
        private readonly emailSender: IEmailSender,
        private readonly pendingRegistrationStore: IPendingRegistrationStore
    ) {}

    async execute(userId: string): Promise<{ registrationId: string; expiresIn: number }> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new ApplicationError("NOT_FOUND", "User not found", "NOT_FOUND");

        if (user.role !== "CUSTOMER") {
            throw new ApplicationError("BAD_REQUEST", "Only customers can become providers", "CONFLICT");
        }

        const otp = this.otpGenerate.generate();
        const otpHash = await this.passwordHasher.hash(otp);
        const registrationId = randomUUID();
        const otpExpiresIn = 60;
        const otpExpiresAt = Date.now() + otpExpiresIn * 1000;
        const registrationTtl = 10 * 60;
console.log("OTP : ",otp)
        await this.pendingRegistrationStore.save(registrationId, {
            name: user.name,
            email: user.email,
            otpHash,
            attempts: 0,
            path: "provider/settings",
            otpExpiresAt,
            for: "BECOME_PROVIDER",
            userId: user.id
        }, registrationTtl);

        await this.emailSender.sendOtp(user.email, otp);

        return { registrationId, expiresIn: otpExpiresIn };
    }
}
