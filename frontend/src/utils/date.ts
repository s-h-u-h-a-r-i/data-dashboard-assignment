/**
 * ### Formats a given Date object as a human-readable date and time string using the user's locale.
 *
 * @param date - The Date object to format.
 * @returns A string representing the formatted date and time. The output reflects the user's current locale and timezone.
 *
 * @remarks
 * The function attempts to detect the user's browser language for localization. The output can be affected by the local timezone.
 * To display UTC or another specific timezone, create the Date object appropriately.
 *
 * @example
 * // Assuming user's timezone is UTC+2:
 * formatDateTime(new Date("2024-06-03T09:30:00Z"));       // "Jun 3, 2024, 11:30"
 * formatDateTime(new Date("2024-06-03T09:30:00+02:00"));  // "Jun 3, 2024, 09:30"
 */
export function formatDateTime(date: Date): string {
  let locale = "ZAR";

  if (typeof navigator !== "undefined" && navigator.language) {
    locale = navigator.language;
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * ### Formats a given Date object as a human-readable date (without time) using the user's locale.
 *
 * @param date - The Date object to format.
 * @returns A string representing the formatted date. The output reflects the user's current locale and timezone.
 *
 * @example
 * // Assuming user's locale is en-ZA:
 * formatDate(new Date("2024-06-03T09:30:00Z")); // "Jun 3, 2024"
 */
export function formatDate(date: Date): string {
  let locale = "ZAR";

  if (typeof navigator !== "undefined" && navigator.language) {
    locale = navigator.language;
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
