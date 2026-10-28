import { buildUserRoute } from "../../presentation/routes/user.routes";
import { buildCustomerRoute } from "../../presentation/routes/customer.routes";
import { buildProviderRoute } from "../../presentation/routes/provider.routes";
import { buildReactivationRoute } from "../../presentation/routes/reactivation.routes";
import {
    customerController,
    addressController,
    providerController,
    reactivationController,
    createUserController
} from "./controllers";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export function createUserRoutes(
    createNotificationUseCase: IUseCase<
        CreateNotificationRequestDto,
        NotificationResponseDto
    >,
) {
    const userController = createUserController(createNotificationUseCase);

    return buildUserRoute({
        user: userController,
        customer: customerController,
        provider: providerController,
        address: addressController
    });
}

export const customerRoutes = buildCustomerRoute({
    customer: customerController
});

export const providerRoutes = buildProviderRoute({
    provider: providerController
});

export const reactivationRoutes = buildReactivationRoute({
    reactivation: reactivationController
});
