import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { Account } from '../types/account';
import { Transaction, TransactionType } from '../types/transaction';
import { Budget, CategoryBudget } from '../types/budget';
import { Bill } from '../types/bill';
import { getMonthKey } from '../utils/date';
import {
  getMonthlyExpenses,
  getMonthlyIncome,
  getWeeklyAverage,
  getDailyAverage,
  getTotalAssets,
  filterTransactions,
  getCategorySpend,
} from '../utils/calculations';
import { getDaysLeftInMonth } from '../utils/date';

interface TransactionFilters {
  type: TransactionType | null;
  accountId: string | null;
}

interface AppState {
  // ── Auth ────────────────────────────────────────────────────
  user: User | null;
  session: Session | null;
  isAuthLoading: boolean;

  // ── Onboarding ───────────────────────────────────────────────
  onboardingComplete: boolean;
  onboardingStep: number;

  // ── Remote data loading ──────────────────────────────────────
  isLoading: boolean;
  error: string | null;
  /** True once the user's profile row has been fetched from Supabase.
   *  Used to prevent the NavigationGuard from redirecting to onboarding
   *  before we know the user's real onboarding status. */
  isProfileLoaded: boolean;

  // ── Data ────────────────────────────────────────────────────
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  bills: Bill[];

  // ── UI State ─────────────────────────────────────────────────
  selectedMonth: string;
  transactionFilters: TransactionFilters;

  // ── Auth actions ─────────────────────────────────────────────
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;

  // ── Onboarding actions ───────────────────────────────────────
  completeOnboarding: () => void;
  setOnboardingStep: (step: number) => void;

  // ── Data loading ─────────────────────────────────────────────
  setAccounts: (accounts: Account[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setBudgets: (budgets: Budget[]) => void;
  setBills: (bills: Bill[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setProfileLoaded: (loaded: boolean) => void;
  clearUserData: () => void;

  // ── Account actions ──────────────────────────────────────────
  addAccount: (account: Account) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  removeAccount: (id: string) => void;

  // ── Transaction actions ──────────────────────────────────────
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;

  // ── Budget actions ────────────────────────────────────────────
  addBudget: (budget: Budget) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;

  // ── Bill actions ──────────────────────────────────────────────
  addBill: (bill: Bill) => void;
  updateBill: (id: string, updates: Partial<Bill>) => void;
  markBillPaid: (id: string, paid: boolean) => void;
  removeBill: (id: string) => void;

  // ── UI actions ────────────────────────────────────────────────
  setSelectedMonth: (month: string) => void;
  setTransactionFilters: (filters: Partial<TransactionFilters>) => void;
  resetTransactionFilters: () => void;

  // ── Selectors ────────────────────────────────────────────────
  getFilteredTransactions: () => Transaction[];
  getMonthSummary: () => {
    totalSpent: number;
    totalIncome: number;
    weeklyAverage: number;
    dailyAverage: number;
    daysLeft: number;
    totalAssets: number;
  };
  getBudgetForMonth: (monthKey?: string) => Budget | undefined;
  getCategorySpentForMonth: (categoryId: string, monthKey?: string) => number;
  getUpcomingBills: () => Bill[];
  getRecurringBills: () => Bill[];
}

export const useAppStore = create<AppState>((set, get) => ({
  // ── Auth ──────────────────────────────────────────────────────
  user: null,
  session: null,
  isAuthLoading: true,

  // ── Onboarding ────────────────────────────────────────────────
  onboardingComplete: false,
  onboardingStep: 0,

  // ── Loading ───────────────────────────────────────────────────
  isLoading: false,
  error: null,
  isProfileLoaded: false,

  // ── Data (starts empty; populated from Supabase after sign-in) ─
  accounts: [],
  transactions: [],
  budgets: [],
  bills: [],

  selectedMonth: getMonthKey(),
  transactionFilters: { type: null, accountId: null },

  // ── Auth actions ──────────────────────────────────────────────
  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      isAuthLoading: false,
    }),

  signOut: async () => {
    const { supabase } = await import('../lib/supabase');
    await supabase.auth.signOut();
    set({
      session: null,
      user: null,
      onboardingComplete: false,
      isProfileLoaded: false,
      accounts: [],
      transactions: [],
      budgets: [],
      bills: [],
    });
  },

  // ── Onboarding actions ────────────────────────────────────────
  completeOnboarding: () => set({ onboardingComplete: true }),
  setOnboardingStep: (step) => set({ onboardingStep: step }),

  // ── Data setters (used by async load actions) ─────────────────
  setAccounts: (accounts) => set({ accounts }),
  setTransactions: (transactions) => set({ transactions }),
  setBudgets: (budgets) => set({ budgets }),
  setBills: (bills) => set({ bills }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setProfileLoaded: (isProfileLoaded) => set({ isProfileLoaded }),
  clearUserData: () =>
    set({ accounts: [], transactions: [], budgets: [], bills: [] }),

  // ── Account actions ───────────────────────────────────────────
  addAccount: (account) =>
    set((s) => ({ accounts: [...s.accounts, account] })),
  updateAccount: (id, updates) =>
    set((s) => ({
      accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),
  removeAccount: (id) =>
    set((s) => ({ accounts: s.accounts.filter((a) => a.id !== id) })),

  // ── Transaction actions ───────────────────────────────────────
  addTransaction: (transaction) =>
    set((s) => ({ transactions: [transaction, ...s.transactions] })),
  removeTransaction: (id) =>
    set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),

  // ── Budget actions ────────────────────────────────────────────
  addBudget: (budget) => set((s) => ({ budgets: [...s.budgets, budget] })),
  updateBudget: (id, updates) =>
    set((s) => ({
      budgets: s.budgets.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    })),

  // ── Bill actions ──────────────────────────────────────────────
  addBill: (bill) => set((s) => ({ bills: [...s.bills, bill] })),
  updateBill: (id, updates) =>
    set((s) => ({
      bills: s.bills.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    })),
  markBillPaid: (id, paid) =>
    set((s) => ({
      bills: s.bills.map((b) => (b.id === id ? { ...b, paid } : b)),
    })),
  removeBill: (id) =>
    set((s) => ({ bills: s.bills.filter((b) => b.id !== id) })),

  // ── UI actions ────────────────────────────────────────────────
  setSelectedMonth: (month) => set({ selectedMonth: month }),
  setTransactionFilters: (filters) =>
    set((s) => ({
      transactionFilters: { ...s.transactionFilters, ...filters },
    })),
  resetTransactionFilters: () =>
    set({ transactionFilters: { type: null, accountId: null } }),

  // ── Selectors ─────────────────────────────────────────────────
  getFilteredTransactions: () => {
    const { transactions, selectedMonth, transactionFilters } = get();
    return filterTransactions(transactions, {
      monthKey: selectedMonth,
      accountId: transactionFilters.accountId,
      type: transactionFilters.type ?? undefined,
    });
  },

  getMonthSummary: () => {
    const { transactions, accounts, selectedMonth } = get();
    return {
      totalSpent: getMonthlyExpenses(transactions, selectedMonth),
      totalIncome: getMonthlyIncome(transactions, selectedMonth),
      weeklyAverage: getWeeklyAverage(transactions, selectedMonth),
      dailyAverage: getDailyAverage(transactions, selectedMonth),
      daysLeft: getDaysLeftInMonth(selectedMonth),
      totalAssets: getTotalAssets(accounts),
    };
  },

  getBudgetForMonth: (monthKey) => {
    const key = monthKey ?? get().selectedMonth;
    return get().budgets.find((b) => b.monthKey === key);
  },

  getCategorySpentForMonth: (categoryId, monthKey) => {
    const key = monthKey ?? get().selectedMonth;
    return getCategorySpend(get().transactions, key, categoryId);
  },

  getUpcomingBills: () => {
    const now = new Date();
    const thirtyDaysLater = new Date(now);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    return get()
      .bills.filter((b) => {
        const due = new Date(b.dueDate);
        return !b.paid && due >= now && due <= thirtyDaysLater;
      })
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      );
  },

  getRecurringBills: () => get().bills.filter((b) => b.isRecurring),
}));
