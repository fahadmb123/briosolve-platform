import { IPendingRegistrationStore } from "../../../../shared/domain/interfaces/IPendingRegistration-store.js";
import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { IPasswordHasher } from "../../../../shared/domain/interfaces/IPasswordHasher.service.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { randomUUID } from "crypto";

import type { EmailVerificationUseCaseOutputDto,RegisterCustomerInput } from "../Dto/customerDto.js";
import type { IOtpGenerator } from "../../../../shared/domain/interfaces/IOtpGenerator.service.js";
import type { IEmailSender } from "../../../../shared/domain/interfaces/IEmailSender.service.js";










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