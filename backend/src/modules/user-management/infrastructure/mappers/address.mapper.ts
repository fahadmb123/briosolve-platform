import { Address } from "../../domain/entities/address.entity.js";

export class AddressMapper {
    static toDomain(raw: any): Address {
        return new Address(
            raw.id,
            raw.user_id,
            raw.house_no,
            raw.area,
            raw.city,
            raw.district,
            raw.state,
            raw.country,
            raw.pincode,
            raw.landmark,
            raw.type,
            raw.latitude,
            raw.longitude,
            raw.created_at,
            raw.updated_at
        );
    }
}
