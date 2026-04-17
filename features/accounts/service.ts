/**
 * Account service — persists to Supabase, syncs Zustand store.
 */
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../store/useAppStore';
import { Account } from '../../types/account';

function toLocalAccount(row: Record<string, unknown>): Account {
  return {
    id: row.id as string,
    name: row.name as string,
    type: row.type as Account['type'],
    balance: Number(row.balance),
    currency: row.currency as string,
    color: row.color as string,
    icon: row.icon as string,
    createdAt: row.created_at as string,
  };
}

export const accountService = {
  async loadAll(): Promise<void> {
    const { setAccounts, setError } = useAppStore.getState();
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      setError(error.message);
      return;
    }
    setAccounts((data ?? []).map(toLocalAccount));
  },

  async add(account: Account): Promise<void> {
    const user = useAppStore.getState().user;
    if (!user) return;

    const { data, error } = await supabase
      .from('accounts')
      .insert({
        // id omitted — let Postgres generate a UUID via gen_random_uuid()
        user_id: user.id,
        name: account.name,
        type: account.type,
        balance: account.balance,
        currency: account.currency,
        color: account.color,
        icon: account.icon,
      })
      .select()
      .single();

    if (error) {
      useAppStore.getState().setError(error.message);
      return;
    }
    if (data) {
      useAppStore.getState().addAccount(toLocalAccount(data));
    }
  },

  async update(id: string, updates: Partial<Account>): Promise<void> {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.balance !== undefined) dbUpdates.balance = updates.balance;
    if (updates.color !== undefined) dbUpdates.color = updates.color;
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon;

    const { error } = await supabase
      .from('accounts')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      useAppStore.getState().setError(error.message);
      return;
    }
    useAppStore.getState().updateAccount(id, updates);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('accounts').delete().eq('id', id);
    if (error) {
      useAppStore.getState().setError(error.message);
      return;
    }
    useAppStore.getState().removeAccount(id);
  },
};
