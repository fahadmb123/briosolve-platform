import { buildCategoryRoute } from "../../presentation/routes/category.routes";
import { buildProviderServiceRoute } from "../../presentation/routes/providerService.routes";
import { buildServiceRoute } from "../../presentation/routes/service.routes";
import { categoryController, providerServiceController, serviceController } from "./controller";

export const categoryRoutes = buildCategoryRoute({
    category:categoryController
})
export const serviceRoutes = buildServiceRoute({
    service:serviceController
})
export const providerServiceRoutes = buildProviderServiceRoute({
    providerService:providerServiceController
})