import type { Prisma } from "@prisma/client";
import { CustomerProfile } from "../../domain/entities/customerProfile.entity";
import { StorageUtil } from "../../../../shared/utils/storage.util";

export type CustomerProfileRecord = Prisma.CustomerProfileGetPayload<{}>;

export class CustomerProfileMapper {
    static toDomain(record: CustomerProfileRecord): CustomerProfile {
        const createdAtRaw: any = record.created_at;
        const updatedAtRaw: any = record.updated_at;

        return new CustomerProfile(
            record.id,
            record.user_id,
            (record as any).current_address_id ?? null,
            StorageUtil.getPublicUrl(record.profile_image),
            record.about,
            createdAtRaw?.epochMilliseconds ? new Date(Number(createdAtRaw.epochMilliseconds)) : new Date(createdAtRaw),
            updatedAtRaw?.epochMilliseconds ? new Date(Number(updatedAtRaw.epochMilliseconds)) : new Date(updatedAtRaw)
        );
    }

    static toPersistence(userId: string, about: string = "") {
        return {
            user_id: userId as never,
            about: about as never
        };
    }
}
