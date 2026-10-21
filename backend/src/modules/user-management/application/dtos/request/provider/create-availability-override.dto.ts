export interface CreateAvailabilityOverrideInputDto {
    userId: string;
    override_date: string;
    type: "DAY_OFF" | "CUSTOM_HOURS";
    start_time?: string | null;
    end_time?: string | null;
    reason?: string | null;
}