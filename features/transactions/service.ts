/**
 * Transaction service — persists to Supabase, syncs Zustand store.
 */
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../store/useAppStore';
import { Transaction } from '../../types/transaction';
import { accountService } from '../accounts/service';

function toLocalTransaction(row: Record<string, unknown>): Transaction {
  return {
    id: row.id as string,
    accountId: row.account_id as string,
    amount: Number(row.amount),
    merchant: row.merchant as string,
    category: row.category as string,
    type: row.type as Transaction['type'],
    source: row.source as Transaction['source'],
    note: row.note as string | undefined,
    date: row.date as string,
  };
}

export const transactionService = {
  async loadAll(): Promise<void> {
    const { setTransactions, setError } = useAppStore.getState();
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .limit(500);

    if (error) {
      setError(error.message);
      return;
    }
    setTransactions((data ?? []).map(toLocalTransaction));
  },

  async add(transaction: Transaction): Promise<void> {
    const user = useAppStore.getState().user;
    if (!user) return;

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        // id omitted — let Postgres generate a UUID via gen_random_uuid()
        user_id: user.id,
        account_id: transaction.accountId || null,
        amount: transaction.amount,
        merchant: transaction.merchant,
        category: transaction.category,
        type: transaction.type,
        source: transaction.source,
        note: transaction.note ?? null,
        date: transaction.date,
      })
      .select()
      .single();

    if (error) {
      useAppStore.getState().setError(error.message);
      return;
    }
    if (data) {
      useAppStore.getState().addTransaction(toLocalTransaction(data));
      // Update the linked account balance
      const account = useAppStore.getState().accounts.find((a) => a.id === transaction.accountId);
      if (account) {
        const delta =
          transaction.type === 'expense' ? -transaction.amount :
          transaction.type === 'income'  ?  transaction.amount :
          0;
        if (delta !== 0) {
          await accountService.update(transaction.accountId, { balance: account.balance + delta });
        }
      }
    }
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      useAppStore.getState().setError(error.message);
      return;
    }
    useAppStore.getState().removeTransaction(id);
  },
};
