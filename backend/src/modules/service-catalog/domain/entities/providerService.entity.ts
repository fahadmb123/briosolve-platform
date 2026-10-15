import { Service } from "./service.entity";

export class ProviderService {
    constructor(
        public readonly id: string,
        public readonly provider_id: string,
        public readonly service_id: string,
        public readonly created_at: Date,
        public readonly service?: Service
    ){}
}
