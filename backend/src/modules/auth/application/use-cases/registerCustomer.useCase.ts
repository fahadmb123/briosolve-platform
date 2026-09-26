import type { RegisterCustomerInput ,RegisterCustomerOutput} from "../dto/customerDto.js";
import { ICustomerAuthRepository } from "../../domain/repositories/customer.repository.js";
import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { IPasswordHasher } from "../../../../shared/domain/interfaces/IPasswordHasher.service.js";
import type { IOtpGenerator } from "../../../../shared/domain/interfaces/IOtpGenerator.service.js";
import type { IEmailSender } from "../../../../shared/domain/interfaces/IEmailSender.service.js";
import { randomUUID } from "crypto";
import { IPendingRegistrationStore } from "../../../../shared/domain/interfaces/IPendingRegistration-store.js";
import { IRegisterCustomerUseCase } from "../../domain/interfaces/use-cases/IRegisterCustomerUseCase.js";



export default class RegisterCustomerUseCase implements IRegisterCustomerUseCase<RegisterCustomerInput,RegisterCustomerOutput> {
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