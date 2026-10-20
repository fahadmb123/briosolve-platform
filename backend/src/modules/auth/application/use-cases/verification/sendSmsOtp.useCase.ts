import { randomUUID } from "node:crypto";
import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IOtpGenerator } from "../../../../../shared/domain/interfaces/services/IOtpGenerator.service";
import { IPasswordHasher } from "../../../../../shared/domain/interfaces/services/IPasswordHasher.service";
import { ISmsService } from "../../../../../shared/domain/interfaces/services/ISms.service";
import { IUseCase } from "../../../../../shared/domain/interfaces/use-cases/IUseCase";
import { IPendingRegistrationStore } from "../../../../../shared/domain/interfaces/IPendingRegistration-store";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { SendSmsOtpUseCaseOutputDto } from "../../dto/response/send-sms-otp.dto";
import { SendSmsOtpUseCaseInputDto } from "../../dto/request/send-sms-otp.dto";





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