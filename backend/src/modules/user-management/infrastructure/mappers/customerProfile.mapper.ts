import type { Prisma } from "@prisma/client";
import { Temporal } from "@js-temporal/polyfill";
import { CustomerProfile } from "../../domain/entities/customerProfile.entity";
import { UpdateCustomerProfileInputDataDto } from "../../application/dtos/request/customer/update-customer-profile.dto";

export type CustomerProfileRecord = Prisma.CustomerProfileGetPayload<{}>;

export class CustomerProfileMapper {
    static toDomain(record: CustomerProfileRecord): CustomerProfile {
        const createdAtRaw: any = record.created_at;
        const updatedAtRaw: any = record.updated_at;

        return new CustomerProfile(
            record.id,
            record.user_id,
            (record as any).current_address_id ?? null,
            record.profile_image ?? null,
            record.about,
            createdAtRaw?.epochMilliseconds ? new Date(Number(createdAtRaw.epochMilliseconds)) : new Date(createdAtRaw),
            updatedAtRaw?.epochMilliseconds ? new Date(Number(updatedAtRaw.epochMilliseconds)) : new Date(updatedAtRaw),
        );
    }

    static toPersistence(userId: string, data?: UpdateCustomerProfileInputDataDto | string) {
        const aboutStr = typeof data === "string" ? data : (data?.about ?? "");
        const imageStr = typeof data === "object" && data !== null ? (data.profile_image ?? null) : null;
        return {
            user_id: userId as never,
            about: aboutStr as never,
            profile_image: (imageStr ?? null) as never,
            created_at: Temporal.Now.instant(),
            updated_at: Temporal.Now.instant()
        };
    }
}
