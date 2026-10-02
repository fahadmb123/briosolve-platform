import { randomUUID } from "node:crypto";
import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { IOtpGenerator } from "../../../../shared/domain/interfaces/IOtpGenerator.service.js";
import { IPasswordHasher } from "../../../../shared/domain/interfaces/IPasswordHasher.service.js";
import { ISmsService } from "../../../../shared/domain/interfaces/ISms.service.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { SendSmsOtpUseCaseInputDto, SendSmsOtpUseCaseOutputDto } from "../dto/authDto.js";
import { IPendingRegistrationStore } from "../../../../shared/domain/interfaces/IPendingRegistration-store.js";
import { IUserRepository } from "../../domain/repositories/user.repository.js";





export class SendSmsOtpUseCase implements IUseCase<SendSmsOtpUseCaseInputDto,SendSmsOtpUseCaseOutputDto>{
    constructor (
        private readonly smsService:ISmsService,
        private readonly otpGenerate : IOtpGenerator,
        private readonly passwordHasher : IPasswordHasher,
        private readonly pendingRegistrationStore : IPendingRegistrationStore,
        private readonly userRepository : IUserRepository
    ){}
    async execute(input:SendSmsOtpUseCaseInputDto):Promise<SendSmsOtpUseCaseOutputDto>{
        const user = await this.userRepository.findById(input.id)

        if (!user) throw new ApplicationError("USER_NOT_FOUND","User not Found","NOT_FOUND")

        if(user.phone === input.phone) throw new ApplicationError("ALREADY_VERIFIED","Already verified","CONFLICT")

        const isPhoneExist = await this.userRepository.findByPhone(input.phone)
                
        if (isPhoneExist) throw new ApplicationError("USER_ALREADY_EXIST", "User with mobile already exist", "CONFLICT")

        const otp = this.otpGenerate.generate()

        const otpHash = await this.passwordHasher.hash(otp)
        const registrationId  = randomUUID()
        
        const registrationTtl = 10 * 60
        const otpExpiresIn = 60
        const otpExpiresAt = Date.now() + otpExpiresIn * 1000

        const forPath =  "UPDATE_PHONE"

        await this.pendingRegistrationStore.save(registrationId,{
            name:user.name,
            email:user.email,
            phone:input.phone,
            otpHash,
            attempts:0,
            path:input.path,
            otpExpiresAt,
            for:forPath,
            userId: input.id
        },
            registrationTtl
        )

        
        await this.smsService.sendOtp(input.phone,otp)
    
        return {registrationId,expiresIn: otpExpiresIn}
    }
}