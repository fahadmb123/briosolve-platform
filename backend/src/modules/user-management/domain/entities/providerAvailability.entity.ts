export type Weekday = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export class ProviderAvailability {
    constructor(
        public readonly id: string,
        public readonly provider_id: string,
        public readonly day_of_week: Weekday,
        public readonly start_time: string,
        public readonly end_time: string,
        public readonly created_at: Date,
        public readonly updated_at: Date
    ) {}
}
