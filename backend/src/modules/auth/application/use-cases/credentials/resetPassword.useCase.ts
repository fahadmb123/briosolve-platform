import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IPasswordHasher } from "../../../../../shared/application/interfaces/services/IPasswordHasher.service";
import { IPendingRegistrationStore } from "../../../../../shared/application/interfaces/IPendingRegistration-store";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { ResetPasswordDto } from "../../dtos/request/reset-password.dto";






export default class ResetPasswordUseCase implements IUseCase<ResetPasswordDto, void> {
    constructor(
        private readonly _pendingRegistrationStore: IPendingRegistrationStore,
        private readonly _passwordHasher: IPasswordHasher,
        private readonly _userRepository: IUserRepository
    ) {}

    async execute(input:ResetPasswordDto): Promise<void> {
       
        if (!input.registrationId) throw new ApplicationError("REGISTRATION_EXPIRED", "Registration session expired", "AUTHENTICATION")

        const data = await this._pendingRegistrationStore.get(input.registrationId)

        if (!data) throw new ApplicationError("REGISTRATION_EXPIRED", "Registration session expired", "AUTHENTICATION")
        
        const user = await this._userRepository.findByEmail(data.email)

        if (!user) throw new ApplicationError("USER_NOT_FOUND", "User not found","NOT_FOUND")

        const passwordHash = await this._passwordHasher.hash(input.password)

        await this._userRepository.updatePassword(user.id,passwordHash)

        await this._pendingRegistrationStore.delete(input.registrationId)

        return 
    }
}
