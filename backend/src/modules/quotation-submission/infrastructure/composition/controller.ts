import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { QuotationController } from "../../presentation/controller/quotation.controller";
import { createSubmitQuotationUseCase, createGetProviderQuotationsUseCase, createUpdateQuotationUseCase } from "./useCases";

export function createQuotationController(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): QuotationController {
    const submitQuotationUseCase = createSubmitQuotationUseCase(createNotificationUseCase);
    const getProviderQuotationsUseCase = createGetProviderQuotationsUseCase();
    const updateQuotationUseCase = createUpdateQuotationUseCase();
    return new QuotationController(submitQuotationUseCase, getProviderQuotationsUseCase, updateQuotationUseCase);
}
