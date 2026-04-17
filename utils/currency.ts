export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  showSign: boolean = false,
): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  if (showSign) {
    return amount >= 0 ? `+${formatted}` : `-${formatted}`;
  }

  return amount < 0 ? `-${formatted}` : formatted;
}

export function formatCompact(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
}

export function parseCurrencyInput(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}
