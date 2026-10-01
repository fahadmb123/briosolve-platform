import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { IPasswordHasher } from "../../../../shared/domain/interfaces/IPasswordHasher.service.js";
import { IPendingRegistrationStore } from "../../../../shared/domain/interfaces/IPendingRegistration-store.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IUserRepository } from "../../domain/repositories/user.repository.js";
import { ResetPasswordDto } from "../dto/resetPasswordDtos.js";





export default class ResetPasswordUseCase implements IUseCase<ResetPasswordDto, void> {
    constructor(
        private readonly pendingRegistrationStore: IPendingRegistrationStore,
        private readonly passwordHasher: IPasswordHasher,
        private readonly userRepository:IUserRepository
    ) {}

    async execute(input:ResetPasswordDto): Promise<void> {
       
        if (!input.registrationId) throw new ApplicationError("REGISTRATION_EXPIRED", "Registration session expired", "AUTHENTICATION")

        const data = await this.pendingRegistrationStore.get(input.registrationId)

        if (!data) throw new ApplicationError("REGISTRATION_EXPIRED", "Registration session expired", "AUTHENTICATION")
        
        const user = await this.userRepository.findByEmail(data.email)

        if (!user) throw new ApplicationError("USER_NOT_FOUND", "User not found","NOT_FOUND")

        const passwordHash = await this.passwordHasher.hash(input.password)

        await this.userRepository.updatePassword(user.id,passwordHash)

        await this.pendingRegistrationStore.delete(input.registrationId)

        return 
    }
}
