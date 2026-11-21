export type WalletTransactionType = "CREDIT" | "DEBIT";
export type WalletTransactionCategory = "REFUND" | "EARNINGS" | "PAYMENT" | "WITHDRAWAL" | "COMMISSION";

export interface WalletTransactionItem {
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

export interface WalletData {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  transactions?: WalletTransactionItem[];
  totalTransactions?: number;
}
