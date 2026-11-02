import { CreateServiceRequestUseCase } from "../../application/use-cases/createServiceRequest.useCase";
import { serviceRequestRepository } from "./respositories";
import { ImageService } from "./services";

export const createServiceRequestUseCase = new CreateServiceRequestUseCase(
    serviceRequestRepository,
    ImageService
);
