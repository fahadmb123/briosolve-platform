import { ServiceRequestRepository } from "../repositories/prismaServiceRequest.repository";
import { ServiceRequestProviderRepository } from "../repositories/prismaServiceRequestProvider.repository";

export const serviceRequestRepository = new ServiceRequestRepository();
export const serviceRequestProviderRepository = new ServiceRequestProviderRepository();

