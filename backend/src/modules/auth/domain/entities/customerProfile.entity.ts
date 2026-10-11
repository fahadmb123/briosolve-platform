export class CustomerProfile {
    constructor(
        public readonly id: string,
        public readonly user_id: string,
        public readonly current_address_id: string | null,
        public readonly profile_image: string | null,
        public readonly about: string,
        public readonly created_at: Date,
        public readonly updated_at: Date,
        public readonly service_radius_km?: number | null,
    ) {}
}
