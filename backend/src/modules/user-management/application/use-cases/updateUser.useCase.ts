import { IUpdateUserStatusUseCase } from "../../domain/interfaces/use-cases/IUpdateUserUseCase.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { IUserAccountBlockRepository } from "../../domain/repositories/IUserAccountBlockRepository.js";
import { UpdateUserStatusDto } from "../Dto/userDto.js";
import { IEmailSender } from "../../../../shared/domain/interfaces/IEmailSender.service.js";
import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";

export default class UpdateUserStatusUseCase implements IUpdateUserStatusUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly userAccountBlockRepository: IUserAccountBlockRepository,
        private readonly emailSender : IEmailSender
    ) {}

    async execute(input: UpdateUserStatusDto): Promise<void> {
        const user = await this.userRepository.findById(input.id)

        if (!user) throw new ApplicationError("USER_NOT_FOUND","user not found","AUTHORIZATION")

        if (input.status === "BLOCKED") {
            const existingBlock = await this.userAccountBlockRepository.findByUserId(input.id);
            if (existingBlock) {
                await this.userAccountBlockRepository.deleteByUserId(input.id);
            }

            const reason = input.reason || "Administrative block";
            await this.userAccountBlockRepository.create({
                user_id: input.id,
                blocked_by: input.adminId || input.id,
                reason
            })

            await this.emailSender.sendBlockEmail(user.email, reason)
            
        } else if (input.status === "ACTIVE") {
            const existingBlock = await this.userAccountBlockRepository.findByUserId(input.id);
            if (existingBlock) {
                await this.userAccountBlockRepository.deleteByUserId(input.id);
            }
            await this.emailSender.sendActivationEmail(user.email)
        }

        await this.userRepository.updateStatus(input.id, input.status);
    }
}