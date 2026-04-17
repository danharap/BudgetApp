/**
 * Bill service — persists to Supabase, syncs Zustand store.
 */
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../store/useAppStore';
import { Bill } from '../../types/bill';

function toLocalBill(row: Record<string, unknown>): Bill {
  return {
    id: row.id as string,
    name: row.name as string,
    amount: Number(row.amount),
    dueDate: row.due_date as string,
    isRecurring: row.is_recurring as boolean,
    recurrenceType: row.recurrence_type as Bill['recurrenceType'],
    accountId: row.account_id as string | undefined,
    notes: row.notes as string | undefined,
    paid: row.paid as boolean,
    icon: row.icon as string | undefined,
    color: row.color as string | undefined,
  };
}

export const billService = {
  async loadAll(): Promise<void> {
    const { setBills, setError } = useAppStore.getState();
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) {
      setError(error.message);
      return;
    }
    setBills((data ?? []).map(toLocalBill));
  },

  async add(bill: Bill): Promise<void> {
    const user = useAppStore.getState().user;
    if (!user) return;

    const { data, error } = await supabase
      .from('bills')
      .insert({
        // id omitted — let Postgres generate a UUID via gen_random_uuid()
        user_id: user.id,
        name: bill.name,
        amount: bill.amount,
        due_date: bill.dueDate,
        is_recurring: bill.isRecurring,
        recurrence_type: bill.recurrenceType ?? null,
        account_id: bill.accountId ?? null,
        notes: bill.notes ?? null,
        paid: bill.paid ?? false,
        icon: bill.icon ?? null,
        color: bill.color ?? null,
      })
      .select()
      .single();

    if (error) {
      useAppStore.getState().setError(error.message);
      return;
    }
    if (data) {
      useAppStore.getState().addBill(toLocalBill(data));
    }
  },

  async update(id: string, updates: Partial<Bill>): Promise<void> {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
    if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
    if (updates.isRecurring !== undefined) dbUpdates.is_recurring = updates.isRecurring;
    if (updates.recurrenceType !== undefined) dbUpdates.recurrence_type = updates.recurrenceType;
    if (updates.paid !== undefined) dbUpdates.paid = updates.paid;
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
    if (updates.color !== undefined) dbUpdates.color = updates.color;

    const { error } = await supabase.from('bills').update(dbUpdates).eq('id', id);
    if (error) {
      useAppStore.getState().setError(error.message);
      return;
    }
    useAppStore.getState().updateBill(id, updates);
  },

  async markPaid(id: string, paid: boolean): Promise<void> {
    const { error } = await supabase
      .from('bills')
      .update({ paid })
      .eq('id', id);
    if (error) {
      useAppStore.getState().setError(error.message);
      return;
    }
    useAppStore.getState().markBillPaid(id, paid);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('bills').delete().eq('id', id);
    if (error) {
      useAppStore.getState().setError(error.message);
      return;
    }
    useAppStore.getState().removeBill(id);
  },
};
