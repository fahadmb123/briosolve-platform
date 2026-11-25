import { randomUUID } from "crypto";
import { db } from "../../../../shared/database/client";
import { Wallet } from "../../domain/entities/wallet.entity";
import { WalletTransaction } from "../../domain/entities/wallet-transaction.entity";
import { IWalletRepository, RecordTransactionParams } from "../../domain/repositories/IWallet.repository";
import { WalletMapper } from "../../application/mappers/wallet.mapper";

export class PrismaWalletRepository implements IWalletRepository {
    async findByUserId(userId: string): Promise<Wallet | null> {
        const record = await db.orm.public.wallets
            .where({ user_id: userId as never })
            .first();

        if (!record) return null;
        return WalletMapper.toDomain(record);
    }

    async createWallet(userId: string, currency: string = "INR"): Promise<Wallet> {
        const id = randomUUID();
        const created = await db.orm.public.wallets.create({
            id: id as never,
            user_id: userId as never,
            balance: "0.00" as never,
            currency: currency as never
        } as never);

        return WalletMapper.toDomain(created);
    }

    async updateBalance(walletId: string, newBalance: number): Promise<Wallet> {
        const updated = await db.orm.public.wallets
            .where({ id: walletId as never })
            .update({
                balance: newBalance.toFixed(2) as never
            } as never);

        return WalletMapper.toDomain(updated);
    }

    async getTransactions(walletId: string, limit: number = 20, offset: number = 0): Promise<{ transactions: WalletTransaction[]; total: number }> {
        const query = db.orm.public.wallet_transactions
            .where({ wallet_id: walletId as never });

        const totalResult = await query.aggregate((agg) => ({ total: agg.count() }));
        const records = await query
            .orderBy((t) => t.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all();

        const transactions = records.map((r: any) => WalletMapper.toTransactionDomain(r));

        return { transactions, total: totalResult.total };
    }

    async recordTransaction(params: RecordTransactionParams): Promise<WalletTransaction> {
        const id = randomUUID();
        const created = await db.orm.public.wallet_transactions.create({
            id: id as never,
            wallet_id: params.walletId as never,
            booking_id: (params.bookingId ?? null) as never,
            type: params.type as never,
            category: params.category as never,
            amount: params.amount.toFixed(2) as never,
            balance_after: params.balanceAfter.toFixed(2) as never,
            description: (params.description ?? null) as never,
            reference_id: (params.referenceId ?? null) as never
        } as never);

        return WalletMapper.toTransactionDomain(created);
    }
}
