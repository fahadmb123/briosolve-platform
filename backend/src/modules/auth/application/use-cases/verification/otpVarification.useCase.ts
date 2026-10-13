import { ApplicationError } from "../../../../../shared/application/errors/applicationError.js";
import { IPendingCustomerRegistration, IPendingRegistrationStore } from "../../../../../shared/domain/interfaces/IPendingRegistration-store.js";
import { OtpVarificationInput } from "../../dto/otpDto.js";
import { IPasswordHasher } from "../../../../../shared/domain/interfaces/IPasswordHasher.service.js";
import { ICustomerRepository } from "../../../domain/repositories/customer.respository.js";
import { User } from "../../../domain/entities/user.entity.js";
import { IUseCase } from "../../../domain/interfaces/use-cases/IUseCase.js";
import { IUserRepository } from "../../../domain/repositories/user.repository.js";



export default class OtpVarificationUseCase implements IUseCase<OtpVarificationInput,{response:User | IPendingCustomerRegistration,for:string, email:string, path?:string}>{
    constructor(
        private readonly PendingRegistrationStore:IPendingRegistrationStore,
        private readonly PasswordHasher:IPasswordHasher,
        private readonly CustomerRepository : ICustomerRepository,
        private readonly UserRepository : IUserRepository
    ){}

    async execute ({registrationId,otp}:OtpVarificationInput):Promise<{response:User | IPendingCustomerRegistration,for:string,email:string,path?:string}>{
        const data = await this.PendingRegistrationStore.get(registrationId)

        if (!registrationId || !data) throw new ApplicationError("REGISTRATION_EXPIRED","Registration session expired","AUTHENTICATION")

        if (data.otpExpiresAt && Date.now() > data.otpExpiresAt) throw new ApplicationError("OTP_EXPIRED","OTP Expired","AUTHENTICATION")

        const isMatch = await this.PasswordHasher.compare(otp,data?.otpHash!)

        if (!isMatch) throw new ApplicationError("INVALID_OTP","Invalid OTP","AUTHENTICATION")

        let response

        switch (data?.for) {
            case "CREATE_CUSTOMER":
                response = await this.CustomerRepository.createCustomer({
                    name: data.name,
                    email: data.email,
                    password: data.passwordHash!
                })
                await this.PendingRegistrationStore.delete(registrationId)
                break;
            case "FORGOT_PASSWORD":
                response = data
                break;
            case "UPDATE":
                response = data
                if (data.userId) {
                    await this.UserRepository.update(data.userId, { email: data.email })
                }
                await this.PendingRegistrationStore.delete(registrationId)
                break;
            case "UPDATE_PHONE":
                response = data
                if (data.userId) {
                    await this.UserRepository.update(data.userId, { phone: data.phone })
                }
                await this.PendingRegistrationStore.delete(registrationId)
                break;
            case "CREATE_PROVIDER":
                response = data;
                await this.PendingRegistrationStore.save(registrationId, data, 30 * 60);
                break;
        }

        return { response: response!, for: data?.for, email: data.email, path: data?.path }
    }
}