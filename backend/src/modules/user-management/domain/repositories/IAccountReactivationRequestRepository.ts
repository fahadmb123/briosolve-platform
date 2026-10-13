import { AccountReactivationRequest } from "../entities/accountReactivationRequest.entity.js";

export type CreateReactivationRequestInput = {
    user_id: string;
    block_id: string;
    reason: string;
};

export interface IAccountReactivationRequestRepository {
    create(data: CreateReactivationRequestInput): Promise<AccountReactivationRequest>;
    findPendingByUserId(userId: string): Promise<AccountReactivationRequest | null>;
    findByUserId(userId: string): Promise<AccountReactivationRequest[]>;
}
