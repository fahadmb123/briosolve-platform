import { Varchar } from "@prisma/orm-postgres/target/codec-types";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client";
import { AccountReactivationRequest } from "../../domain/entities/accountReactivationRequest.entity";
import {
    IAccountReactivationRequestRepository,
    CreateReactivationRequestInput,
    GetReactivationRequestsInput
} from "../../domain/repositories/IAccountReactivationRequestRepository";
import { AccountReactivationRequestMapper } from "../mappers/accountReactivationRequest.mapper";

export class AccountReactivationRequestRepository implements IAccountReactivationRequestRepository {
    async create(data: CreateReactivationRequestInput): Promise<AccountReactivationRequest> {
        const created = await db.orm.public.account_reactivation_requests.create(
            AccountReactivationRequestMapper.toPersistence(data) as never
        );

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

        return records.map(AccountReactivationRequestMapper.toDomain)
    }

    async getRequests(input: GetReactivationRequestsInput): Promise<{ requests: AccountReactivationRequest[]; total: number }> {
        const { page, limit, search, filter, role, sort } = input;
        const skip = (page - 1) * limit;

        let query = db.orm.public.account_reactivation_requests
            .include("user", (u) => u.include("customer_profile").include("provider_profile"))
            .include("block")
            .include("reviewer");

        if (filter && filter !== "ALL") {
            query = query.where({ status: filter as any });
        }

        if (sort === "asc") {
            query = query.orderBy((req) => req.created_at.asc());
        } else {
            query = query.orderBy((req) => req.created_at.desc());
        }

        let records = await query.all();

        if (search) {
            const queryLower = search.trim().toLowerCase();
            records = records.filter((rec) => {
                return (rec as any).user?.email?.toLowerCase().includes(queryLower);
            });
        }

        if (role && role !== "ALL") {
            records = records.filter((rec) => (rec as any).user?.role === role);
        }

        const total = records.length;
        const paginated = records.slice(skip, skip + limit);

        return {
            requests: paginated.map(AccountReactivationRequestMapper.toDomain),
            total
        };
    }

    async deleteByUserId(userId: string): Promise<void> {
        await db.orm.public.account_reactivation_requests.where({ user_id: userId }).delete();
    }
}
