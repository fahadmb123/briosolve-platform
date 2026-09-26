import { ApplicationError } from "../../../../shared/application/errors/application-error.js";
import { PendingRegistrationStore } from "../../../../shared/application/interfaces/services/pending-registration-store.js";
import { UseCase } from "../../../../shared/application/interfaces/use-case/use-case.js";
import { OtpVarificationInput } from "../dto/otp.types.js";
import { PasswordHasher } from "../../../../shared/application/interfaces/services/password-hasher.service.js";


export default class OtpVarificationUseCaseImpl implements UseCase<OtpVarificationInput,void>{
    constructor(
        private readonly PendingRegistrationStore:PendingRegistrationStore,
        private readonly PasswordHasher:PasswordHasher
    ){}

    async execute ({registrationId,otp}:OtpVarificationInput):Promise<void>{
        const data = await this.PendingRegistrationStore.get(registrationId)
        if (!registrationId) throw new ApplicationError("OTP_EXPIRED","OTP Expired","AUTHENTICATION")
        if (!this.PasswordHasher.compare(otp,data?.otpHash!)) throw new ApplicationError("INVALID_OTP","Invalid OTP","AUTHENTICATION") 
        return 
    }
}