export function roundToIQD(price: number): number {
  return Math.round(price / 250) * 250;
}

export function formatIQD(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${new Intl.NumberFormat("en-US").format(Math.round(num))} IQD`;
}

export function formatPrice(amount: number | string): string {
  return formatIQD(amount);
}
