import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { IPendingRegistrationStore } from "../../../../shared/domain/interfaces/IPendingRegistration-store.js";
import { OtpVarificationInput } from "../dto/otpDto.js";
import { IPasswordHasher } from "../../../../shared/domain/interfaces/IPasswordHasher.service.js";
import { IOtpVarificationUseCase } from "../../domain/interfaces/use-cases/IOtpVarificationUseCase.js";
import { ICustomerRepository } from "../../domain/repositories/customer.repository.js";
import { Customer } from "../../domain/entities/customer.entity.js";



export default class OtpVarificationUseCase implements IOtpVarificationUseCase<OtpVarificationInput,Customer>{
    constructor(
        private readonly PendingRegistrationStore:IPendingRegistrationStore,
        private readonly PasswordHasher:IPasswordHasher,
        private readonly CustomerRepository : ICustomerRepository
    ){}

    async execute ({registrationId,otp}:OtpVarificationInput):Promise<Customer>{
        const data = await this.PendingRegistrationStore.get(registrationId)
        if (!registrationId) throw new ApplicationError("OTP_EXPIRED","OTP Expired","AUTHENTICATION")
        const isMatch = await this.PasswordHasher.compare(otp,data?.otpHash!)
        if (!isMatch) throw new ApplicationError("INVALID_OTP","Invalid OTP","AUTHENTICATION")
        let response
        switch (data?.for){
            case "CREATE_CUSTOMER":
                response = this.CustomerRepository.createCustomer(
                    {
                        name:data.name,
                        email:data.email,
                        password:data.passwordHash
                    }
                )
        }
        return response!
    }
}