import { WalletTransactionCategory, WalletTransactionType } from "../../../domain/entities/wallet-transaction.entity";

export interface WalletTransactionResponseDto {
    id: string;
    walletId: string;
    bookingId: string | null;
    type: WalletTransactionType;
    category: WalletTransactionCategory;
    amount: number;
    balanceAfter: number;
    description: string | null;
    referenceId: string | null;
    createdAt: string;
}

export interface WalletResponseDto {
    id: string;
    userId: string;
    balance: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
    transactions?: WalletTransactionResponseDto[];
    totalTransactions?: number;
}
