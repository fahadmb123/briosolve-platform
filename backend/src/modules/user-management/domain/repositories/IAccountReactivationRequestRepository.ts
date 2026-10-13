import { AccountReactivationRequest } from "../entities/accountReactivationRequest.entity.js";

export type CreateReactivationRequestInput = {
    user_id: string;
    block_id: string;
    reason: string;
};

export type GetReactivationRequestsInput = {
    page: number;
    limit: number;
    search?: string;
    filter?: string;
    role?: string;
    sort?: "asc" | "desc";
};

export interface IAccountReactivationRequestRepository {
    create(data: CreateReactivationRequestInput): Promise<AccountReactivationRequest>;
    findPendingByUserId(userId: string): Promise<AccountReactivationRequest | null>;
    findByUserId(userId: string): Promise<AccountReactivationRequest[]>;
    getRequests(input: GetReactivationRequestsInput): Promise<{ requests: AccountReactivationRequest[]; total: number }>;
    deleteByUserId(userId: string): Promise<void>
}
