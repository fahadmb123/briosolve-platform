export type KycStatus = "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";

export class ProviderProfile {
    constructor(
        public readonly id: string,
        public readonly user_id: string,
        public readonly business_name: string,
        public readonly experience: string,
        public readonly bio: string,
        public readonly profile_image: string | null,
        public readonly created_at: Date,
        public readonly updated_at: Date,
        public readonly service_radius_km?: number | null,
        public readonly accepting_leads?: boolean,
        public readonly travel_buffer_minutes?: number,
        public readonly completed_jobs?: number,
        public readonly kyc_status?: KycStatus,
        public readonly skills?: string | null
    ) {}
}
