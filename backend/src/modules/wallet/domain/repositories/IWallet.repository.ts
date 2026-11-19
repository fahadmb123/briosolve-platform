import { Wallet } from "../entities/wallet.entity";
import { WalletTransaction, WalletTransactionCategory, WalletTransactionType } from "../entities/wallet-transaction.entity";

export interface RecordTransactionParams {
    walletId: string;
    bookingId?: string | null;
    type: WalletTransactionType;
    category: WalletTransactionCategory;
    amount: number;
    balanceAfter: number;
    description?: string | null;
    referenceId?: string | null;
}

export interface IWalletRepository {
    findByUserId(userId: string): Promise<Wallet | null>;
    createWallet(userId: string, currency?: string): Promise<Wallet>;
    updateBalance(walletId: string, newBalance: number): Promise<Wallet>;
    getTransactions(walletId: string, limit?: number, offset?: number): Promise<{ transactions: WalletTransaction[]; total: number }>;
    recordTransaction(params: RecordTransactionParams): Promise<WalletTransaction>;
}
