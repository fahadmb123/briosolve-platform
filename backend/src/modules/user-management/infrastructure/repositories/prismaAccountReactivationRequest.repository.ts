import { Varchar } from "@prisma/orm-postgres/target/codec-types";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client.js";
import { AccountReactivationRequest } from "../../domain/entities/accountReactivationRequest.entity.js";
import { IAccountReactivationRequestRepository, CreateReactivationRequestInput } from "../../domain/repositories/IAccountReactivationRequestRepository.js";
import { AccountReactivationRequestMapper } from "../mappers/accountReactivationRequest.mapper.js";

export class AccountReactivationRequestRepository implements IAccountReactivationRequestRepository {
    async create(data: CreateReactivationRequestInput): Promise<AccountReactivationRequest> {
        const created = await db.orm.public.account_reactivation_requests.create({
            user_id: data.user_id,
            block_id: data.block_id,
            reason: data.reason as Varchar<1000>,
            status: "PENDING"
        } as never);

        return AccountReactivationRequestMapper.toDomain(created);
    }

    async findPendingByUserId(userId: string): Promise<AccountReactivationRequest | null> {
        const record = await db.orm.public.account_reactivation_requests
            .where({ user_id: userId, status: "PENDING" as any })
            .first();

        if (!record) return null;
        return AccountReactivationRequestMapper.toDomain(record);
    }

    async findByUserId(userId: string): Promise<AccountReactivationRequest[]> {
        const records = await db.orm.public.account_reactivation_requests
            .where({ user_id: userId })
            .orderBy((req) => req.created_at.desc())
            .all();

        return records.map(AccountReactivationRequestMapper.toDomain);
    }
}
