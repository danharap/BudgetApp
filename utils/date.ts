import { format, parseISO, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';

export function getMonthKey(date: Date = new Date()): string {
  return format(date, 'yyyy-MM');
}

export function formatMonthKey(monthKey: string): string {
  return format(parseISO(`${monthKey}-01`), 'MMMM yyyy');
}

export function formatMonthShort(monthKey: string): string {
  return format(parseISO(`${monthKey}-01`), 'MMM yyyy');
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy');
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d');
}

export function formatTime(dateStr: string): string {
  return format(parseISO(dateStr), 'h:mm a');
}

export function formatDayLabel(dateStr: string): string {
  const date = parseISO(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
    return 'Today';
  }
  if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
    return 'Yesterday';
  }
  return format(date, 'EEEE, MMM d');
}

export function getDaysLeftInMonth(monthKey?: string): number {
  const now = new Date();
  if (monthKey) {
    const monthDate = parseISO(`${monthKey}-01`);
    const end = endOfMonth(monthDate);
    return differenceInDays(end, now);
  }
  return differenceInDays(endOfMonth(now), now);
}

export function isInMonth(dateStr: string, monthKey: string): boolean {
  const date = parseISO(dateStr);
  const monthStart = startOfMonth(parseISO(`${monthKey}-01`));
  const monthEnd = endOfMonth(parseISO(`${monthKey}-01`));
  return date >= monthStart && date <= monthEnd;
}

export function navigateMonth(monthKey: string, direction: 1 | -1): string {
  const date = parseISO(`${monthKey}-01`);
  date.setMonth(date.getMonth() + direction);
  return getMonthKey(date);
}
