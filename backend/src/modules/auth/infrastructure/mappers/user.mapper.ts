import { User } from "../../domain/entities/user.entity.js";


export class UserMapper {
    static toDomain(data: any): User {
        return new User(
            data.id,
            data.name,
            data.email,
            data.phone,
            data.password_hash,
            data.role,
            data.status,
            data.email_verified,
            data.phone_verified,
            data.current_address || data.current_address_id,
            data.created_at?.epochMilliseconds ? new Date(data.created_at.epochMilliseconds) : new Date(data.created_at),
            data.updated_at?.epochMilliseconds ? new Date(data.updated_at.epochMilliseconds) : new Date(data.updated_at)
        )
    }
} 