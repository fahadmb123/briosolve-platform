import { ServiceRequest } from "./serviceRequest.entity";
import { ProviderProfile } from "../../../user-management/domain/entities/providerProfile.entity";

export type ServiceRequestProviderStatus = "MATCHED" | "VIEWED" | "QUOTED" | "DECLINED" | "EXPIRED";

export class ServiceRequestProvider {
    constructor(
        public readonly id: string,
        public readonly service_request_id: string,
        public readonly provider_id: string,
        public readonly status: ServiceRequestProviderStatus,
        public readonly matched_at: Date,
        public readonly viewed_at: Date | null,
        public readonly service_request?: ServiceRequest,
        public readonly provider?: ProviderProfile
    ) {}
}

