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
        private readonly _customerRepository: IUserRepository,
        private readonly _passwordHasher: IPasswordHasher,
        private readonly _otpGenerate: IOtpGenerator,
        private readonly _pendingRegistrationStore: IPendingRegistrationStore,
        private readonly _emailSender: IEmailSender
    ){}

    async execute (input:EmailVerificationUseCaseInputDto):Promise<EmailVerificationUseCaseOutputDto>{
        const user = await this._customerRepository.findByEmail(input.email)
        if (!user) throw new ApplicationError("USER_NOT_FOUND","User not Found","NOT_FOUND")

        const customer = await this._customerRepository.findById(user.id)
        if (!customer) throw new ApplicationError("USER_NOT_FOUND","User not Found","NOT_FOUND")

        if (customer.status === "BLOCKED") throw new ApplicationError("BLOCKED_ACCOUNT","User is Blocked","AUTHORIZATION")
        const otp = this._otpGenerate.generate()

        const otpHash = await this._passwordHasher.hash(otp)
        const registrationId  = randomUUID()
        
        const registrationTtl = 10 * 60
        const otpExpiresIn = 60
        const otpExpiresAt = Date.now() + otpExpiresIn * 1000

        const path = "reset-password"

        const forPath =  "FORGOT_PASSWORD"

        await this._pendingRegistrationStore.save(registrationId,{
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

        
        await this._emailSender.sendOtp(input.email,otp)
    
        return {registrationId,expiresIn: otpExpiresIn}
    }
}