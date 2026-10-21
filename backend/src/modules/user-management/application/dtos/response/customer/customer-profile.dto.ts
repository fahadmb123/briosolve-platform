export type CustomerProfileResponseDto = {
    id: string;
    user_id: string;
    current_address_id: string | null;
    profile_image: string | null;
    about: string;
    service_radius_km?: number | null;
    created_at: Date;
    updated_at: Date;
}
