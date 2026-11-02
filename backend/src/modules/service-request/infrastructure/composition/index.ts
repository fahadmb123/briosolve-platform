import { buildServiceRequestRoute } from "../../presentation/routes/serviceRequest.routes";
import { serviceRequestController } from "./controller";

export const serviceRequestRoutes = buildServiceRequestRoute({
    serviceRequest: serviceRequestController
});
