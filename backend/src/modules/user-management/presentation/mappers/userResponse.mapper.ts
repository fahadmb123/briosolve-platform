import { User } from "../../domain/entities/user.entity.js";
import { UserResponseDto } from "../../application/Dto/userDto.js";

export class UserResponseMapper {
    static toDto(user: User): UserResponseDto {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role as "CUSTOMER" | "ADMIN" | "INVESTIGATOR" | "PROVIDER",
            status: user.status as "ACTIVE" | "INACTIVE" | "BLOCKED",
            email_verified: user.email_verified,
            phone_verified: user.phone_verified,
            current_address_id: user.current_address_id,
            created_at: user.created_at,
            updated_at: user.updated_at
        };
    }
}
