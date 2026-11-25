import { Varchar } from "@prisma/orm-postgres/target/codec-types";
import type { Prisma } from "@prisma/client";
import { AccountReactivationRequest } from "../../domain/entities/accountReactivationRequest.entity";
import { CreateReactivationRequestInput } from "../../domain/repositories/IAccountReactivationRequestRepository";
import { UserMapper, UserRecord } from "./user.mapper";
import { UserAccountBlockMapper, UserAccountBlockRecord } from "./userAccountBlock.mapper";

export type AccountReactivationRequestRecord = Prisma.AccountReactivationRequestGetPayload<{}>;

export class AccountReactivationRequestMapper {
    static toDomain(record: AccountReactivationRequestRecord): AccountReactivationRequest {
        const reviewedAtRaw: any = record.reviewed_at;
        const createdAtRaw: any = record.created_at;
        const updatedAtRaw: any = record.updated_at;

        return new AccountReactivationRequest(
            record.id,
            record.user_id,
            record.block_id,
            record.reason,
            record.status,
            record.reviewed_by || null,
            reviewedAtRaw ? (reviewedAtRaw?.epochMilliseconds ? new Date(Number(reviewedAtRaw.epochMilliseconds)) : new Date(reviewedAtRaw)) : null,
            createdAtRaw?.epochMilliseconds ? new Date(Number(createdAtRaw.epochMilliseconds)) : new Date(createdAtRaw),
            updatedAtRaw?.epochMilliseconds ? new Date(Number(updatedAtRaw.epochMilliseconds)) : new Date(updatedAtRaw),
            record.user ? UserMapper.toDomain(record.user as UserRecord) : undefined,
            record.block ? UserAccountBlockMapper.toDomain(record.block as UserAccountBlockRecord) : undefined,
            record.reviewer ? UserMapper.toDomain(record.reviewer as UserRecord) : null
        );
    }

    static toPersistence(data: CreateReactivationRequestInput) {
        return {
            user_id: data.user_id,
            block_id: data.block_id,
            reason: data.reason as Varchar<1000>,
            status: "PENDING" as const
        };
    }
}
