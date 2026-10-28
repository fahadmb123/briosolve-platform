import { buildUserRoute } from "../../presentation/routes/user.routes";
import { buildCustomerRoute } from "../../presentation/routes/customer.routes";
import { buildProviderRoute } from "../../presentation/routes/provider.routes";
import { buildReactivationRoute } from "../../presentation/routes/reactivation.routes";
import {
    userController,
    customerController,
    addressController,
    providerController,
    reactivationController
} from "./controllers";

export const userRoutes = buildUserRoute({
    user: userController,
    customer: customerController,
    provider: providerController,
    address: addressController
});

export const customerRoutes = buildCustomerRoute({
    customer: customerController
});

export const providerRoutes = buildProviderRoute({
    provider: providerController
});

export const reactivationRoutes = buildReactivationRoute({
    reactivation: reactivationController
});
