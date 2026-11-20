import { WalletTransactionCategory } from "../../../domain/entities/wallet-transaction.entity";

export interface CreditWalletInputDto {
    userId: string;
    amount: number;
    category: WalletTransactionCategory;
    bookingId?: string | null;
    description?: string | null;
    referenceId?: string | null;
}