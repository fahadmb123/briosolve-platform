export type AvailabilityOverrideType = "DAY_OFF" | "CUSTOM_HOURS";

export class ProviderAvailabilityOverride {
    constructor(
        public readonly id: string,
        public readonly provider_id: string,
        public readonly override_date: Date,
        public readonly type: AvailabilityOverrideType,
        public readonly start_time: string | null,
        public readonly end_time: string | null,
        public readonly reason: string | null,
        public readonly created_at?: Date,
        public readonly updated_at?: Date
    ) {}
}
