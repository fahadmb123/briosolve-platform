import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { buildQuotationRoute } from "../../presentation/routes/quotation.routes";
import { createQuotationController } from "./controller";

export function createQuotationRoutes(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
) {
    const quotationController = createQuotationController(createNotificationUseCase);
    return buildQuotationRoute({
        quotation: quotationController
    });
}

export * from "./repositories";
export * from "./useCases";
export * from "./controller";
