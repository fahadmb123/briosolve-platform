import { buildVerificationRoute } from "../../presentation/routes/verification.routes";
import { createVerificationController } from "./controller";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export function createVerificationRoutes(
    createNotificationUseCase: IUseCase<
        CreateNotificationRequestDto,
        NotificationResponseDto
    >,
) {
    const verificationController = createVerificationController(createNotificationUseCase);

    return buildVerificationRoute({
        verification: verificationController,
    });
}
