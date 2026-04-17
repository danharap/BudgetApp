/**
 * Deep-link import screen — handles budgetapp://import?amount=X&merchant=Y...
 * Opens the Add Transaction form pre-filled with the parsed parameters.
 *
 * iOS Shortcut example:
 *   Open URL: budgetapp://import?amount=12.50&merchant=Starbucks
 */
import { useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { parseImportParams } from '../utils/import';

export default function ImportTransactionScreen() {
  const rawParams = useLocalSearchParams<{
    amount?: string;
    merchant?: string;
    date?: string;
    source?: string;
    accountId?: string;
  }>();

  useEffect(() => {
    const { amount, merchant, date, accountId } = parseImportParams(rawParams);

    // Build the add-transaction URL with pre-filled params
    const parts: string[] = [];
    if (amount) parts.push(`amount=${encodeURIComponent(amount)}`);
    if (merchant) parts.push(`merchant=${encodeURIComponent(merchant)}`);
    if (date) parts.push(`date=${encodeURIComponent(date)}`);
    if (accountId) parts.push(`accountId=${encodeURIComponent(accountId)}`);

    const query = parts.length > 0 ? `?${parts.join('&')}` : '';
    router.replace((`/add-transaction${query}`) as any);
  }, []);

  return null;
}
