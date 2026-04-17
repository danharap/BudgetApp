export type RecurrenceType = 'monthly' | 'weekly' | 'yearly' | 'custom';

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string; // ISO date string
  isRecurring: boolean;
  recurrenceType?: RecurrenceType;
  accountId?: string;
  notes?: string;
  paid?: boolean;
  icon?: string;
  color?: string;
}
