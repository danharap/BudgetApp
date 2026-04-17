import { Budget } from '../types/budget';

export const mockBudgets: Budget[] = [
  {
    id: 'budget-2026-04',
    monthKey: '2026-04',
    totalLimit: 3500.00,
    categories: [
      { categoryId: 'food', limit: 600 },
      { categoryId: 'transport', limit: 200 },
      { categoryId: 'shopping', limit: 300 },
      { categoryId: 'entertainment', limit: 150 },
      { categoryId: 'health', limit: 200 },
      { categoryId: 'housing', limit: 1800 },
      { categoryId: 'utilities', limit: 150 },
      { categoryId: 'subscriptions', limit: 50 },
      { categoryId: 'travel', limit: 250 },
    ],
    createdAt: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'budget-2026-03',
    monthKey: '2026-03',
    totalLimit: 3500.00,
    categories: [
      { categoryId: 'food', limit: 600 },
      { categoryId: 'transport', limit: 200 },
      { categoryId: 'shopping', limit: 300 },
      { categoryId: 'health', limit: 200 },
      { categoryId: 'housing', limit: 1800 },
      { categoryId: 'utilities', limit: 150 },
      { categoryId: 'subscriptions', limit: 50 },
    ],
    createdAt: '2026-03-01T00:00:00.000Z',
  },
];
