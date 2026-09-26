import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { IPendingRegistrationStore } from "../../../../shared/domain/interfaces/IPendingRegistration-store.js";
import { OtpVarificationInput } from "../dto/otpDto.js";
import { IPasswordHasher } from "../../../../shared/domain/interfaces/IPasswordHasher.service.js";
import { IOtpVarificationUseCase } from "../../domain/interfaces/use-cases/IOtpVarificationUseCase.js";

export default class OtpVarificationUseCase implements IOtpVarificationUseCase<OtpVarificationInput,void>{
    constructor(
        private readonly PendingRegistrationStore:IPendingRegistrationStore,
        private readonly PasswordHasher:IPasswordHasher
    ){}

    async execute ({registrationId,otp}:OtpVarificationInput):Promise<void>{
        const data = await this.PendingRegistrationStore.get(registrationId)
        if (!registrationId) throw new ApplicationError("OTP_EXPIRED","OTP Expired","AUTHENTICATION")
        if (!this.PasswordHasher.compare(otp,data?.otpHash!)) throw new ApplicationError("INVALID_OTP","Invalid OTP","AUTHENTICATION") 
        return 
    }
}