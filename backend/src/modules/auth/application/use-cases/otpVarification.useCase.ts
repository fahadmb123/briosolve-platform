import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { IPendingCustomerRegistration, IPendingRegistrationStore } from "../../../../shared/domain/interfaces/IPendingRegistration-store.js";
import { OtpVarificationInput } from "../dto/otpDto.js";
import { IPasswordHasher } from "../../../../shared/domain/interfaces/IPasswordHasher.service.js";
import { ICustomerRepository } from "../../domain/repositories/customer.respository.js";
import { Customer } from "../../domain/entities/customer.entity.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";



export default class OtpVarificationUseCase implements IUseCase<OtpVarificationInput,{response:Customer | IPendingCustomerRegistration,for:string}>{
    constructor(
        private readonly PendingRegistrationStore:IPendingRegistrationStore,
        private readonly PasswordHasher:IPasswordHasher,
        private readonly CustomerRepository : ICustomerRepository
    ){}

    async execute ({registrationId,otp}:OtpVarificationInput):Promise<{response:Customer | IPendingCustomerRegistration,for:string}>{
        const data = await this.PendingRegistrationStore.get(registrationId)
        if (!registrationId || !data) throw new ApplicationError("REGISTRATION_EXPIRED","Registration session expired","AUTHENTICATION")
        if (data.otpExpiresAt && Date.now() > data.otpExpiresAt) throw new ApplicationError("OTP_EXPIRED","OTP Expired","AUTHENTICATION")
        const isMatch = await this.PasswordHasher.compare(otp,data?.otpHash!)
        if (!isMatch) throw new ApplicationError("INVALID_OTP","Invalid OTP","AUTHENTICATION")
        let response
        switch (data?.for){
            case "CREATE_CUSTOMER":
                response = this.CustomerRepository.createCustomer(
                    {
                        name:data.name,
                        email:data.email,
                        password:data.passwordHash!
                    }
                )
                await this.PendingRegistrationStore.delete(registrationId)
            case "FORGOT_PASSWORD" :
                response = data
        }
        return {response:response!,for:data?.for}
    }
}