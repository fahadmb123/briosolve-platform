import { IPendingRegistrationStore } from "../../../../../shared/application/interfaces/IPendingRegistration-store";
import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IPasswordHasher } from "../../../../../shared/application/interfaces/services/IPasswordHasher.service";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { randomUUID } from "crypto";
import type { IOtpGenerator } from "../../../../../shared/application/interfaces/services/IOtpGenerator.service";
import type { IEmailSender } from "../../../../../shared/application/interfaces/services/IEmailSender.service";
import { RegisterCustomerInput } from "../../dtos/request/customer/register-customer.dto";
import { EmailVerificationUseCaseOutputDto } from "../../dtos/response/user/email-verification.dto";










export default class RegisterCustomerUseCase implements IUseCase<RegisterCustomerInput,EmailVerificationUseCaseOutputDto> {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _passwordHasher: IPasswordHasher,
        private readonly _otpGenerate: IOtpGenerator,
        private readonly _emailSender: IEmailSender,
        private readonly _pendingRegistrationStore: IPendingRegistrationStore
    ){}

    async execute (input:RegisterCustomerInput):Promise<EmailVerificationUseCaseOutputDto>{
        const isEmailExist = await this._userRepository.findByEmail(input.email)
        if (isEmailExist) throw new ApplicationError("USER_EMAIL_ALREADY_EXIST","User with email already exist","CONFLICT")

        const otp = this._otpGenerate.generate()

        const passwordHash = await this._passwordHasher.hash(input.password)
        const otpHash = await this._passwordHasher.hash(otp)
        const registrationId  = randomUUID()
        
        const registrationTtl = 10 * 60
        const otpExpiresIn = 60
        const otpExpiresAt = Date.now() + otpExpiresIn * 1000
        const path = "login"
        await this._pendingRegistrationStore.save(registrationId,{
            name:input.name,
            email:input.email,
            passwordHash,
            otpHash,
            attempts:0,
            path,
            otpExpiresAt,
            
            for:"CREATE_CUSTOMER",
        },
            registrationTtl
        )
        
        
        await this._emailSender.sendOtp(input.email,otp)
    
        return {registrationId,expiresIn: otpExpiresIn}
    }
}