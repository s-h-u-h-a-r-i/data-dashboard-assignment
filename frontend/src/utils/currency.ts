/**
 * ### Formats a given amount as a currency string using the specified currency code.
 *
 * @param amount - The numeric amount to format.
 * @param currency - The ISO 4217 currency code (e.g., "USD", "EUR", "ZAR"). Defaults to "ZAR".
 * @returns  The formatted currency string for the specified locale and currency.
 *
 * @example
 * formatCurrency(1234.56); // "R 1 234,56"
 * formatCurrency(1234.56, "USD"); // "$1,234.56"
 */
export function formatCurrency(
  amount: number,
  currency: string = "ZAR"
): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: currency,
  }).format(amount);
}
