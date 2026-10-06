import { CustomerProfile } from "../../domain/entities/customerProfile.entity.js";
import { CustomerProfileResponseDto } from "../../application/Dto/userDto.js";

export class CustomerProfileResponseMapper {
    static toDto(profile: CustomerProfile): CustomerProfileResponseDto {
        return {
            id: profile.id,
            user_id: profile.user_id,
            current_address_id: profile.current_address_id,
            profile_image: profile.profile_image,
            about: profile.about,
            created_at: profile.created_at,
            updated_at: profile.updated_at
        };
    }
}
