export type Weekday = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface ProviderAvailabilityItem {
    id: string;
    provider_id: string;
    day_of_week: Weekday;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
}

export interface SetAvailabilitySlotPayload {
    day_of_week: Weekday;
    start_time: string;
    end_time: string;
}

export type AvailabilityOverrideType = 'DAY_OFF' | 'CUSTOM_HOURS';

export interface ProviderAvailabilityOverrideItem {
    id: string;
    provider_id: string;
    override_date: string;
    type: AvailabilityOverrideType;
    start_time: string | null;
    end_time: string | null;
    reason: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateAvailabilityOverridePayload {
    override_date: string;
    type: AvailabilityOverrideType;
    start_time?: string | null;
    end_time?: string | null;
    reason?: string | null;
}
