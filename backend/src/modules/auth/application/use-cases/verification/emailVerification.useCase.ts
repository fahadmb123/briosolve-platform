import { randomUUID } from "crypto"
import { IUserRepository } from "../../../domain/repositories/user.repository"
import { IPasswordHasher } from "../../../../../shared/application/interfaces/services/IPasswordHasher.service"
import { ApplicationError } from "../../../../../shared/application/errors/applicationError"
import { IOtpGenerator } from "../../../../../shared/application/interfaces/services/IOtpGenerator.service"
import { IPendingRegistrationStore } from "../../../../../shared/application/interfaces/IPendingRegistration-store"
import { IEmailSender } from "../../../../../shared/application/interfaces/services/IEmailSender.service"
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase"
import { EmailVerificationUseCaseOutputDto } from "../../dtos/response/email-verification.dto"
import { EmailVerificationUseCaseInputDto } from "../../dtos/request/email-verification.dto"




export default class EmailVerificationUseCase implements IUseCase<EmailVerificationUseCaseInputDto,EmailVerificationUseCaseOutputDto>{
    constructor(
        private readonly customerRepository:IUserRepository,
        private readonly passwordHasher:IPasswordHasher,
        private readonly otpGenerate : IOtpGenerator,
        private readonly PendingRegistrationStore:IPendingRegistrationStore,
        private readonly EmailSender : IEmailSender
    ){}

    async execute (input:EmailVerificationUseCaseInputDto):Promise<EmailVerificationUseCaseOutputDto>{
        const user = await this.customerRepository.findByEmail(input.email)
        if (!user) throw new ApplicationError("USER_NOT_FOUND","User not Found","NOT_FOUND")

        const customer = await this.customerRepository.findById(user.id)
        if (!customer) throw new ApplicationError("USER_NOT_FOUND","User not Found","NOT_FOUND")

        if (customer.status === "BLOCKED") throw new ApplicationError("BLOCKED_ACCOUNT","User is Blocked","AUTHORIZATION")
        const otp = this.otpGenerate.generate()

        const otpHash = await this.passwordHasher.hash(otp)
        const registrationId  = randomUUID()
        
        const registrationTtl = 10 * 60
        const otpExpiresIn = 60
        const otpExpiresAt = Date.now() + otpExpiresIn * 1000

        const path = "reset-password"

        const forPath =  "FORGOT_PASSWORD"

        await this.PendingRegistrationStore.save(registrationId,{
            name:user.name,
            email:input.email,
            otpHash,
            attempts:0,
            path,
            otpExpiresAt,
            for:forPath,
        },
            registrationTtl
        )

        
        await this.EmailSender.sendOtp(input.email,otp)
    
        return {registrationId,expiresIn: otpExpiresIn}
    }
}