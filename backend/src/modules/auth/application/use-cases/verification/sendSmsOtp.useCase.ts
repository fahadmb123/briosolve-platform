import { randomUUID } from "node:crypto";
import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IOtpGenerator } from "../../../../../shared/application/interfaces/services/IOtpGenerator.service";
import { IPasswordHasher } from "../../../../../shared/application/interfaces/services/IPasswordHasher.service";
import { ISmsService } from "../../../../../shared/application/interfaces/services/ISms.service";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { IPendingRegistrationStore } from "../../../../../shared/application/interfaces/IPendingRegistration-store";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { SendSmsOtpUseCaseOutputDto } from "../../dtos/response/send-sms-otp.dto";
import { SendSmsOtpUseCaseInputDto } from "../../dtos/request/send-sms-otp.dto";





export class SendSmsOtpUseCase implements IUseCase<SendSmsOtpUseCaseInputDto,SendSmsOtpUseCaseOutputDto>{
    constructor (
        private readonly _smsService: ISmsService,
        private readonly _otpGenerate: IOtpGenerator,
        private readonly _passwordHasher: IPasswordHasher,
        private readonly _pendingRegistrationStore: IPendingRegistrationStore,
        private readonly _userRepository: IUserRepository
    ){}
    async execute(input:SendSmsOtpUseCaseInputDto):Promise<SendSmsOtpUseCaseOutputDto>{
        const user = await this._userRepository.findById(input.id)

        if (!user) throw new ApplicationError("USER_NOT_FOUND","User not Found","NOT_FOUND")

        if(user.phone === input.phone) throw new ApplicationError("ALREADY_VERIFIED","Already verified","CONFLICT")

        const isPhoneExist = await this._userRepository.findByPhone(input.phone)
                
        if (isPhoneExist) throw new ApplicationError("USER_ALREADY_EXIST", "User with mobile already exist", "CONFLICT")

        const otp = this._otpGenerate.generate()

        const otpHash = await this._passwordHasher.hash(otp)
        const registrationId  = randomUUID()
        
        const registrationTtl = 10 * 60
        const otpExpiresIn = 60
        const otpExpiresAt = Date.now() + otpExpiresIn * 1000

        const forPath =  "UPDATE_PHONE"

        await this._pendingRegistrationStore.save(registrationId,{
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

        
        await this._smsService.sendOtp(input.phone,otp)
    
        return {registrationId,expiresIn: otpExpiresIn}
    }
}