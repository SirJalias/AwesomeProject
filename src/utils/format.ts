/**
 * Format a numeric amount as a USD price string, e.g. 1299 -> "$1,299.00".
 */
export function formatPrice(amount: number): string {
  const [integer, decimals] = amount.toFixed(2).split('.');
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `$${grouped}.${decimals}`;
}
