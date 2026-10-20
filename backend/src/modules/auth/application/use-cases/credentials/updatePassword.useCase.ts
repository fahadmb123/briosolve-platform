import { ApplicationError } from "../../../../../shared/application/errors/applicationError"
import { IPasswordHasher } from "../../../../../shared/application/interfaces/services/IPasswordHasher.service"
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase"
import { IUserRepository } from "../../../domain/repositories/user.repository"
import { UpdatePasswordInputDto } from "../../dtos/request/update-password.dto"







export default class UpdatePasswordUseCase implements IUseCase<UpdatePasswordInputDto, void> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: IPasswordHasher
    ) { }

    async execute(input: UpdatePasswordInputDto): Promise<void> {
        const user = await this.userRepository.findById(input.id)

        if (!user) throw new ApplicationError("USER_NOT_FOUND", "User not found","AUTHORIZATION")
        
        const isMatch = await this.passwordHasher.compare(input.data.currentPassword,user.passwordHash)

        if (!isMatch) throw new ApplicationError("INCORRECT_PASSWORD", "Incorrect password","NOT_FOUND")
        
        const hashPassword = await this.passwordHasher.hash(input.data.newPassword)

        await this.userRepository.updatePassword(input.id,hashPassword)

        return 
    }
}