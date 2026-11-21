export type WalletTransactionType = "CREDIT" | "DEBIT";
export type WalletTransactionCategory = "REFUND" | "EARNINGS" | "PAYMENT" | "WITHDRAWAL" | "COMMISSION";

export class WalletTransaction {
    constructor(
        public readonly id: string,
        public readonly wallet_id: string,
        public readonly booking_id: string | null,
        public readonly type: WalletTransactionType,
        public readonly category: WalletTransactionCategory,
        public readonly amount: number,
        public readonly balance_after: number,
        public readonly description: string | null,
        public readonly reference_id: string | null,
        public readonly created_at: Date
    ) {}
}
