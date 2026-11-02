import { ServiceRequestController } from "../../presentation/controller/serviceRequest.controller";
import { createServiceRequestUseCase } from "./useCases";

export const serviceRequestController = new ServiceRequestController(createServiceRequestUseCase);
