import { IUpdateUserStatusUseCase } from "../../interfaces/use-cases/users/update-user.interface";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IUserAccountBlockRepository } from "../../../domain/repositories/IUserAccountBlockRepository";
import { IEmailSender } from "../../../../../shared/application/interfaces/services/IEmailSender.service";
import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IAccountReactivationRequestRepository } from "../../../domain/repositories/IAccountReactivationRequestRepository";
import { UpdateUserStatusDto } from "../../dtos/request/user/update-user-status.dto";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../../notification/application/dtos/response/notification-response.dto";
import { logger } from "../../../../../shared/infrastructure/logger/logger";

export default class UpdateUserStatusUseCase implements IUpdateUserStatusUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _userAccountBlockRepository: IUserAccountBlockRepository,
        private readonly _emailSender: IEmailSender,
        private readonly _acountReactivationRequestRepository: IAccountReactivationRequestRepository,
        private readonly _createNotificationUseCase: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
    ) {}

    async execute(input: UpdateUserStatusDto): Promise<void> {
        const user = await this._userRepository.findById(input.id);

        if (!user) throw new ApplicationError("USER_NOT_FOUND", "user not found", "AUTHORIZATION");

        const existReactivationRequest = await this._acountReactivationRequestRepository.findPendingByUserId(input.id);

        if (existReactivationRequest) await this._acountReactivationRequestRepository.deleteByUserId(input.id);

        if (input.status === "BLOCKED") {
            const existingBlock = await this._userAccountBlockRepository.findByUserId(input.id);

            if (existingBlock) await this._userAccountBlockRepository.deleteByUserId(input.id);

            const reason = input.reason || "Administrative block";

            await this._userAccountBlockRepository.create({
                user_id: input.id,
                blocked_by: input.adminId || input.id,
                reason
            });

            if (existReactivationRequest) {
                await this._emailSender.sendRequestDeniedEmail(user.email, reason);
            } else {
                await this._emailSender.sendBlockEmail(user.email, reason);
            }
        } else if (input.status === "ACTIVE") {
            const existingBlock = await this._userAccountBlockRepository.findByUserId(input.id);

            if (existingBlock) await this._userAccountBlockRepository.deleteByUserId(input.id);

            await this._emailSender.sendActivationEmail(user.email);
        }

        await this._userRepository.updateStatus(input.id, input.status);

        if (input.status === "BLOCKED" || input.status === "ACTIVE") {
            const isBlocked = input.status === "BLOCKED";

            const notification = {
                recipientId: input.id,
                type: isBlocked ? "ERROR" : "SUCCESS",
                title: isBlocked ? "Account Suspended" : "Account Activated",
                message: isBlocked
                    ? input.reason || "Your account has been suspended."
                    : "Your account has been activated",
            } as const;

            try {
                await this._createNotificationUseCase.execute(notification);
            } catch (error) {
                logger.error(
                    { err: error, userId: input.id },
                    "Failed to create account status notification",
                );
            }
        }
    }
}
