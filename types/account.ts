export type AccountType =
  | 'bank'
  | 'credit_card'
  | 'savings'
  | 'investment'
  | 'cash'
  | 'other';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  color: string;
  icon: string;
  createdAt: string;
}

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  bank: 'Bank Account',
  credit_card: 'Credit Card',
  savings: 'Savings',
  investment: 'Investment',
  cash: 'Cash',
  other: 'Other',
};

export const ACCOUNT_TYPE_ICONS: Record<AccountType, string> = {
  bank: 'business',
  credit_card: 'card',
  savings: 'wallet',
  investment: 'trending-up',
  cash: 'cash',
  other: 'ellipsis-horizontal',
};
