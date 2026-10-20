import { IPendingRegistrationStore } from "../../../../shared/application/interfaces/IPendingRegistration-store";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { IPasswordHasher } from "../../../../shared/application/interfaces/services/IPasswordHasher.service";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { randomUUID } from "crypto";

import type { EmailVerificationUseCaseOutputDto,RegisterCustomerInput } from "../dtos/customerDto";
import type { IOtpGenerator } from "../../../../shared/application/interfaces/services/IOtpGenerator.service";
import type { IEmailSender } from "../../../../shared/application/interfaces/services/IEmailSender.service";










export default class RegisterCustomerUseCase implements IUseCase<RegisterCustomerInput,EmailVerificationUseCaseOutputDto> {
    constructor(private readonly userRepository : IUserRepository,
        readonly passwordHasher:IPasswordHasher,
        readonly otpGenerate:IOtpGenerator,
        readonly EmailSender:IEmailSender,
        readonly PendingRegistrationStore:IPendingRegistrationStore
    ){}

    async execute (input:RegisterCustomerInput):Promise<EmailVerificationUseCaseOutputDto>{
        const isEmailExist = await this.userRepository.findByEmail(input.email)
        if (isEmailExist) throw new ApplicationError("USER_EMAIL_ALREADY_EXIST","User with email already exist","CONFLICT")

        const otp = this.otpGenerate.generate()

        const passwordHash = await this.passwordHasher.hash(input.password)
        const otpHash = await this.passwordHasher.hash(otp)
        const registrationId  = randomUUID()
        
        const registrationTtl = 10 * 60
        const otpExpiresIn = 60
        const otpExpiresAt = Date.now() + otpExpiresIn * 1000
        const path = "login"
        console.log("OTP : ",otp)
        await this.PendingRegistrationStore.save(registrationId,{
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
        
        
        await this.EmailSender.sendOtp(input.email,otp)
    
        return {registrationId,expiresIn: otpExpiresIn}
    }
}