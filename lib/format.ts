export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}

export function parseCurrencyToCents(raw: string): number {
  const normalized = raw.replace(/[^0-9.-]/g, "").trim();
  if (!normalized) {
    return 0;
  }

  const parsed = Number.parseFloat(normalized);
  if (Number.isNaN(parsed)) {
    throw new Error(`Unable to parse currency value: ${raw}`);
  }

  return Math.round(parsed * 100);
}

export function formatDate(date: Date | null | undefined): string {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}
