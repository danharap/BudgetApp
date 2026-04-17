/**
 * parseImportParams — parses deep-link / iOS Shortcut parameters
 * for pre-filling the Add Transaction form.
 *
 * Supported URL formats:
 *   budgetapp://import?amount=12.50&merchant=Starbucks&date=2026-04-17
 *   budgetapp://import?amount=12.50&merchant=Whole+Foods&accountId=acc-123
 *
 * All parameters are optional except amount.
 */
export interface ImportParams {
  amount?: string;
  merchant?: string;
  date?: string;
  source?: string;
  accountId?: string;
}

export function parseImportParams(
  params: Record<string, string | string[] | undefined>,
): ImportParams {
  const str = (key: string): string | undefined => {
    const val = params[key];
    if (!val) return undefined;
    return Array.isArray(val) ? val[0] : val;
  };

  const amount = str('amount');
  const merchant = str('merchant');
  const date = str('date');
  const source = str('source');
  const accountId = str('accountId');

  return { amount, merchant, date, source, accountId };
}
