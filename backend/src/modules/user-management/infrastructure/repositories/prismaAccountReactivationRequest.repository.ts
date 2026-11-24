import { Varchar } from "@prisma/orm-postgres/target/codec-types";
import { db } from "../../../../shared/database/client";
import { AccountReactivationRequest } from "../../domain/entities/accountReactivationRequest.entity";
import {
    IAccountReactivationRequestRepository,
    CreateReactivationRequestInput,
    GetReactivationRequestsInput
} from "../../domain/repositories/IAccountReactivationRequestRepository";
import { AccountReactivationRequestMapper } from "../../application/mappers/accountReactivationRequest.mapper";

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
            .orderBy((req) => req.updated_at.desc())
            .all();

        return records.map(AccountReactivationRequestMapper.toDomain)
    }

    async getRequests(input: GetReactivationRequestsInput): Promise<{ requests: AccountReactivationRequest[]; total: number }> {
        const { page, limit, search, filter, role, sort } = input;
        const skip = (page - 1) * limit;

        let targetUserIds: string[] | null = null;
        if ((search && search.trim()) || (role && role !== "ALL")) {
            let userQuery = db.orm.public.users;
            if (role && role !== "ALL") {
                userQuery = userQuery.where({ role: role as any });
            }
            if (search && search.trim()) {
                userQuery = userQuery.where((u) => u.email.ilike(`%${search.trim()}%`));
            }
            const matchingUsers = await userQuery.select("id").all();
            targetUserIds = matchingUsers.map((u) => u.id);
            if (targetUserIds.length === 0) {
                return { requests: [], total: 0 };
            }
        }

        let query = db.orm.public.account_reactivation_requests;

        if (filter && filter !== "ALL") {
            query = query.where({ status: filter as any });
        }

        if (targetUserIds !== null) {
            query = query.where((req) => req.user_id.in(targetUserIds!));
        }

        if (sort === "asc") {
            query = query.orderBy((req) => req.updated_at.asc());
        } else {
            query = query.orderBy((req) => req.updated_at.desc());
        }

        const totalResult = await query.aggregate((agg) => ({ total: agg.count() }));
        const records = await query
            .include("user", (u) => u.include("customer_profile").include("provider_profile"))
            .include("block")
            .include("reviewer")
            .offset(skip)
            .limit(limit)
            .all();

        return {
            requests: records.map(AccountReactivationRequestMapper.toDomain),
            total: totalResult.total
        };
    }

    async deleteByUserId(userId: string): Promise<void> {
        await db.orm.public.account_reactivation_requests.where({ user_id: userId }).delete();
    }
}
