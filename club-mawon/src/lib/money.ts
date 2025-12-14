export function formatMoney(cents: number, currency: string) {
  const value = cents / 100;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}
