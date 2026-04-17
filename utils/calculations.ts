import { Transaction } from '../types/transaction';
import { Account } from '../types/account';
import { Budget } from '../types/budget';
import { isInMonth } from './date';

export function getTotalAssets(accounts: Account[]): number {
  return accounts.reduce((sum, a) => sum + a.balance, 0);
}

export function getMonthlyExpenses(
  transactions: Transaction[],
  monthKey: string,
): number {
  return transactions
    .filter((t) => t.type === 'expense' && isInMonth(t.date, monthKey))
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getMonthlyIncome(
  transactions: Transaction[],
  monthKey: string,
): number {
  return transactions
    .filter((t) => t.type === 'income' && isInMonth(t.date, monthKey))
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getWeeklyAverage(
  transactions: Transaction[],
  monthKey: string,
): number {
  const total = getMonthlyExpenses(transactions, monthKey);
  return total / 4.33;
}

export function getDailyAverage(
  transactions: Transaction[],
  monthKey: string,
): number {
  const total = getMonthlyExpenses(transactions, monthKey);
  return total / 30;
}

export function getCategorySpend(
  transactions: Transaction[],
  monthKey: string,
  categoryId: string,
): number {
  return transactions
    .filter(
      (t) =>
        t.type === 'expense' &&
        t.category === categoryId &&
        isInMonth(t.date, monthKey),
    )
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getBudgetProgress(budget: Budget, spent: number): number {
  if (budget.totalLimit === 0) return 0;
  return Math.min(spent / budget.totalLimit, 1);
}

export function getCategoryProgress(
  limit: number,
  spent: number,
): number {
  if (limit === 0) return 0;
  return Math.min(spent / limit, 1);
}

export function groupTransactionsByDate(
  transactions: Transaction[],
): Record<string, Transaction[]> {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return sorted.reduce<Record<string, Transaction[]>>((groups, txn) => {
    const key = txn.date.split('T')[0];
    if (!groups[key]) groups[key] = [];
    groups[key].push(txn);
    return groups;
  }, {});
}

export function filterTransactions(
  transactions: Transaction[],
  opts: {
    monthKey?: string;
    accountId?: string | null;
    type?: string | null;
    search?: string;
  },
): Transaction[] {
  return transactions.filter((t) => {
    if (opts.monthKey && !isInMonth(t.date, opts.monthKey)) return false;
    if (opts.accountId && t.accountId !== opts.accountId) return false;
    if (opts.type && t.type !== opts.type) return false;
    if (
      opts.search &&
      !t.merchant.toLowerCase().includes(opts.search.toLowerCase())
    )
      return false;
    return true;
  });
}
