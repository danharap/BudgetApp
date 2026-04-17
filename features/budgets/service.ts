/**
 * Budget service — persists to Supabase, syncs Zustand store.
 */
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../store/useAppStore';
import { Budget } from '../../types/budget';

function toLocalBudget(
  row: Record<string, unknown>,
  categories: Array<Record<string, unknown>>,
): Budget {
  return {
    id: row.id as string,
    monthKey: row.month_key as string,
    totalLimit: Number(row.total_limit),
    categories: categories.map((c) => ({
      categoryId: c.category_id as string,
      limit: Number(c.limit_amount),
    })),
    createdAt: row.created_at as string,
  };
}

export const budgetService = {
  async loadAll(): Promise<void> {
    const { setBudgets, setError } = useAppStore.getState();

    const { data: budgetRows, error: budgetError } = await supabase
      .from('budgets')
      .select('*')
      .order('month_key', { ascending: false });

    if (budgetError) {
      setError(budgetError.message);
      return;
    }

    const budgetIds = (budgetRows ?? []).map((b: Record<string, unknown>) => b.id as string);
    let categoryRows: Array<Record<string, unknown>> = [];

    if (budgetIds.length > 0) {
      const { data: cats, error: catError } = await supabase
        .from('budget_categories')
        .select('*')
        .in('budget_id', budgetIds);

      if (catError) {
        setError(catError.message);
        return;
      }
      categoryRows = (cats ?? []) as Array<Record<string, unknown>>;
    }

    const budgets = (budgetRows ?? []).map((row: Record<string, unknown>) => {
      const cats = categoryRows.filter((c) => c.budget_id === row.id);
      return toLocalBudget(row, cats);
    });

    setBudgets(budgets);
  },

  async add(budget: Budget): Promise<void> {
    const user = useAppStore.getState().user;
    if (!user) return;

    const { data: budgetRow, error: budgetError } = await supabase
      .from('budgets')
      .upsert(
        {
          // id omitted — let Postgres generate UUID; onConflict handles updates
          user_id: user.id,
          month_key: budget.monthKey,
          total_limit: budget.totalLimit,
        },
        { onConflict: 'user_id,month_key' },
      )
      .select()
      .single();

    if (budgetError) {
      useAppStore.getState().setError(budgetError.message);
      return;
    }

    if (budgetRow && budget.categories.length > 0) {
      const categoryInserts = budget.categories.map((c) => ({
        budget_id: budgetRow.id as string,
        user_id: user.id,
        category_id: c.categoryId,
        limit_amount: c.limit,
      }));

      const { error: catError } = await supabase
        .from('budget_categories')
        .upsert(categoryInserts, { onConflict: 'budget_id,category_id' });

      if (catError) {
        useAppStore.getState().setError(catError.message);
        return;
      }
    }

    // Use DB-returned id so the local store has the real UUID.
    if (budgetRow) {
      useAppStore.getState().addBudget({ ...budget, id: budgetRow.id as string });
    }
  },
};
