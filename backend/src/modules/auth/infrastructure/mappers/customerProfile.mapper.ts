import { CustomerProfile } from "../../domain/entities/customerProfile.entity";


export class CustomerProfileMapper {
    static toDomain(data:any):CustomerProfile{
        return new CustomerProfile(
            data.id,
            data.user_id,
            data.current_address_id,
            data.profile_image,
            data.about,
            data.created_at,
            data.updated_at,
            data.service_radius_km
        )
    }
}
