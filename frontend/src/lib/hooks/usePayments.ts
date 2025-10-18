import { useQuery } from "@tanstack/react-query";

import { PaymentFilterParams, PaymentListResponse } from "@/types/api";

import { getPayments } from "../api";

/**
 * ### React Query hook for fetching paginated and filtered payments
 *
 * Provides automatic caching, background refetching, and loading/error states
 * for payment data. Supports pagination and filtering by status and date range.
 *
 * @param params Optional filter and pagination parameters
 * @returns The React Query result object containing payment data,
 *  loading and error state, etc.
 *
 * @example
 * ```tsx
 * function PaymentsList() {
 *   const { data, isLoading, error } = usePayments({
 *     page: 1,
 *     page_size: 10,
 *     status: PaymentStatus.PAID
 *   });
 *
 *   if (isLoading) return <div>Loading...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *
 *   return (
 *     <div>
 *       {data.items.map((payment) => (
 *         <div key={payment.id}>{payment.customer_name}: {payment.amount}</div>
 *       ))}
 *      <p>Page {data.pagination.page} of {data.pagination.total_pages}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function usePayments(params?: PaymentFilterParams) {
  return useQuery<PaymentListResponse>({
    queryKey: ["payments", params],
    queryFn: () => getPayments(params),
  });
}
