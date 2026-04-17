/**
 * Loads the user's data records from Supabase after sign-in.
 * Called from the tabs layout so data is fresh whenever the user
 * reaches the main app (after auth + onboarding).
 *
 * Onboarding status is loaded separately in the root _layout.tsx
 * NavigationGuard so the router can make gating decisions immediately.
 */
import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { accountService } from '../features/accounts/service';
import { transactionService } from '../features/transactions/service';
import { budgetService } from '../features/budgets/service';
import { billService } from '../features/bills/service';

export function useLoadAppData() {
  const user = useAppStore((s) => s.user);
  const setLoading = useAppStore((s) => s.setLoading);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      await Promise.all([
        accountService.loadAll(),
        transactionService.loadAll(),
        budgetService.loadAll(),
        billService.loadAll(),
      ]);
      if (!cancelled) {
        setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);
}
