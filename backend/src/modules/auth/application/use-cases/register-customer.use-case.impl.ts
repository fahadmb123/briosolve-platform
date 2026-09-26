import { IUseCase } from "../../../../shared/application/interfaces/use-case/use-case.js";
import type { RegisterCustomerInput ,RegisterCustomerOutput} from "../dto/customer-auth.type.js";
import { ICustomerAuthRepository } from "../../domain/repositories/customer.repository.js";
import { ApplicationError } from "../../../../shared/application/errors/application-error.js";
import { IPasswordHasher } from "../../../../shared/application/interfaces/services/password-hasher.service.js";
import type { IOtpGenerator } from "../../../../shared/application/interfaces/services/otp-generator.service.js";
import type { IEmailSender } from "../../../../shared/application/interfaces/services/email-sender.service.js";
import { randomUUID } from "crypto";
import { IPendingRegistrationStore } from "../../../../shared/application/interfaces/services/pending-registration-store.js";



export default class RegisterCustomerUseCaseImpl implements IUseCase<RegisterCustomerInput,RegisterCustomerOutput> {
    constructor(private readonly customerAuthRepository : ICustomerAuthRepository,
        readonly passwordHasher:IPasswordHasher,
        readonly otpGenerate:IOtpGenerator,
        readonly EmailSender:IEmailSender,
        readonly PendingRegistrationStore:IPendingRegistrationStore
    ){}

    async execute (input:RegisterCustomerInput):Promise<RegisterCustomerOutput>{
        const isEmailExist = await this.customerAuthRepository.findByEmail(input.email)
        if (isEmailExist) throw new ApplicationError("USER_EMAIL_ALREADY_EXIST","User with email already exist","CONFLICT")

        const otp = this.otpGenerate.generate()

        const passwordHash = await this.passwordHasher.hash(input.password)
        const otpHash = await this.passwordHasher.hash(otp)
        const registrationId  = randomUUID()
        
        await this.PendingRegistrationStore.save(registrationId,{
            name:input.name,
            email:input.email,
            passwordHash,
            otpHash,
            attempts:0},
            60
        )
        
        
        await this.EmailSender.sendOtp(input.email,otp)
    
        return {registrationId,expiresIn: 60}
    }
}