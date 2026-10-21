import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IPendingCustomerRegistration, IPendingRegistrationStore } from "../../../../../shared/application/interfaces/IPendingRegistration-store"
import { IPasswordHasher } from "../../../../../shared/application/interfaces/services/IPasswordHasher.service";
import { ICustomerRepository } from "../../../domain/repositories/customer.respository";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { OtpVarificationInput } from "../../dtos/request/otp-verification.dto";
import { UserResponseDto } from "../../dtos/response/user.dto";
import { UserMapper } from "../../../infrastructure/mappers/user.mapper";



export default class OtpVarificationUseCase implements IUseCase<OtpVarificationInput,{response:UserResponseDto | IPendingCustomerRegistration,for:string, email:string, path?:string}>{
    constructor(
        private readonly PendingRegistrationStore:IPendingRegistrationStore,
        private readonly PasswordHasher:IPasswordHasher,
        private readonly CustomerRepository : ICustomerRepository,
        private readonly UserRepository : IUserRepository
    ){}

    async execute ({registrationId,otp}:OtpVarificationInput):Promise<{response:UserResponseDto | IPendingCustomerRegistration,for:string,email:string,path?:string}>{
        const data = await this.PendingRegistrationStore.get(registrationId)

        if (!registrationId || !data) throw new ApplicationError("REGISTRATION_EXPIRED","Registration session expired","AUTHENTICATION")

        if (data.otpExpiresAt && Date.now() > data.otpExpiresAt) throw new ApplicationError("OTP_EXPIRED","OTP Expired","AUTHENTICATION")

        const isMatch = await this.PasswordHasher.compare(otp,data?.otpHash!)

        if (!isMatch) throw new ApplicationError("INVALID_OTP","Invalid OTP","AUTHENTICATION")

        let response

        switch (data?.for) {
            case "CREATE_CUSTOMER":
                response = UserMapper.toDto(await this.CustomerRepository.createCustomer({
                    name: data.name,
                    email: data.email,
                    password: data.passwordHash!
                })) as UserResponseDto
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
                await this.PendingRegistrationStore.save(registrationId, { ...data, isVerified: true } as any, 15 * 60);
                break;
            case "BECOME_PROVIDER":
                response = data;
                await this.PendingRegistrationStore.save(registrationId, { ...data, isVerified: true } as any, 15 * 60);
                break;
            case "REACTIVATE_ACCOUNT":
                response = data;
                await this.PendingRegistrationStore.save(registrationId, { ...data, isVerified: true } as any, 15 * 60);
                break;
        }

        return { response: response!, for: data?.for, email: data.email, path: data?.path }
    }
}