import { useQuery } from "@tanstack/react-query";

import { SummaryResponse } from "@/types/api";

import { getSummary } from "../api";

/**
 * ### React Query hook for fetching summary metrics
 *
 * Provides automatic caching, background refetching, and loading/error states
 * for the dashboard summary data.
 *
 * @returns The React Query result object containing summary data,
 * loading and error state, etc.
 *
 * @example
 * ```tsx
 * function DashboardSummary() {
 *   const { data, isLoading, error } = useSummary();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       <p>Total Payments: {data.payments.total_count}</p>
 *       <p>Total Invoices: {data.invoices.total_count}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSummary() {
  return useQuery<SummaryResponse>({
    queryKey: ["summary"],
    queryFn: getSummary,
  });
}
