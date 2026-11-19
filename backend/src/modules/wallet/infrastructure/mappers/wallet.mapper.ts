import { Wallet } from "../../domain/entities/wallet.entity";
import { WalletTransaction, WalletTransactionCategory, WalletTransactionType } from "../../domain/entities/wallet-transaction.entity";
import { WalletResponseDto, WalletTransactionResponseDto } from "../../application/dtos/response/wallet-response.dto";

export class WalletMapper {
    private static parseDate(val: any): Date {
        if (!val) return new Date();
        if (typeof val === "object" && val !== null && "epochMilliseconds" in val) {
            const epoch = (val as { epochMilliseconds: bigint | number }).epochMilliseconds;
            return new Date(Number(epoch));
        }
        return new Date(val);
    }

    static toDomain(record: any): Wallet {
        return new Wallet(
            record.id,
            record.user_id,
            Number(record.balance ?? 0),
            record.currency ?? "INR",
            this.parseDate(record.created_at),
            this.parseDate(record.updated_at)
        );
    }

    static toTransactionDomain(record: any): WalletTransaction {
        return new WalletTransaction(
            record.id,
            record.wallet_id,
            record.booking_id ?? null,
            record.type as WalletTransactionType,
            record.category as WalletTransactionCategory,
            Number(record.amount ?? 0),
            Number(record.balance_after ?? 0),
            record.description ?? null,
            record.reference_id ?? null,
            this.parseDate(record.created_at)
        );
    }

    static toTransactionResponseDto(transaction: WalletTransaction): WalletTransactionResponseDto {
        return {
            id: transaction.id,
            walletId: transaction.wallet_id,
            bookingId: transaction.booking_id,
            type: transaction.type,
            category: transaction.category,
            amount: transaction.amount,
            balanceAfter: transaction.balance_after,
            description: transaction.description,
            referenceId: transaction.reference_id,
            createdAt: transaction.created_at.toISOString()
        };
    }

    static toResponseDto(wallet: Wallet, transactions?: WalletTransaction[], totalTransactions?: number): WalletResponseDto {
        return {
            id: wallet.id,
            userId: wallet.user_id,
            balance: wallet.balance,
            currency: wallet.currency,
            createdAt: wallet.created_at.toISOString(),
            updatedAt: wallet.updated_at.toISOString(),
            transactions: transactions?.map(tx => this.toTransactionResponseDto(tx)),
            totalTransactions
        };
    }
}
