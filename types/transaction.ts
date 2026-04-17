export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionSource = 'manual' | 'automation' | 'initial_balance';

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  merchant: string;
  category: string;
  note?: string;
  date: string;
  type: TransactionType;
  source: TransactionSource;
}
