import { IUpdateUserStatusUseCase } from "../../domain/interfaces/use-cases/IUpdateUserUseCase";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUserAccountBlockRepository } from "../../domain/repositories/IUserAccountBlockRepository";
import { UpdateUserStatusDto } from "../Dto/userDto";
import { IEmailSender } from "../../../../shared/domain/interfaces/IEmailSender.service";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { IAccountReactivationRequestRepository } from "../../domain/repositories/IAccountReactivationRequestRepository";

export default class UpdateUserStatusUseCase implements IUpdateUserStatusUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly userAccountBlockRepository: IUserAccountBlockRepository,
        private readonly emailSender : IEmailSender,
        private readonly acountReactivationRequestRepository : IAccountReactivationRequestRepository
    ) {}

    async execute(input: UpdateUserStatusDto): Promise<void> {
        const user = await this.userRepository.findById(input.id)

        if (!user) throw new ApplicationError("USER_NOT_FOUND","user not found","AUTHORIZATION")

        const existReactivationRequest = await this.acountReactivationRequestRepository.findPendingByUserId(input.id)
        if (existReactivationRequest) await this.acountReactivationRequestRepository.deleteByUserId(input.id)

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

            if (existReactivationRequest) {
                await this.emailSender.sendRequestDeniedEmail(user.email,reason)
            }else {
                await this.emailSender.sendBlockEmail(user.email, reason)
            }
        } else if (input.status === "ACTIVE") {

            const existingBlock = await this.userAccountBlockRepository.findByUserId(input.id)
            if (existingBlock) await this.userAccountBlockRepository.deleteByUserId(input.id)

            await this.emailSender.sendActivationEmail(user.email)
        }

        await this.userRepository.updateStatus(input.id, input.status);
    }
}