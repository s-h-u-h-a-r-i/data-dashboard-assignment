import { useQuery } from "@tanstack/react-query";

import { InvoiceFilterParams, InvoiceListResponse } from "@/types/api";

import { getInvoices } from "../api";

/**
 * ### React Query hook for fetching paginated and filtered invoices
 *
 * Provides automatic caching, background refetching, and loading/error states
 * for invoices data. Supports pagination and filtering by status and date range.
 *
 * @param params Optional filter and pagination parameters
 * @returns The React Query result object containing invoice data,
 *  loading and error state, etc.
 *
 * @example
 * ```tsx
 * function InvoicesList() {
 *   const { data, isLoading, error } = useInvoices({
 *     page: 1,
 *     page_size: 10,
 *     status: InvoiceStatus.UNPAID
 *   });
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       {data.items.map(invoice => (
 *         <div key={invoice.id}>{invoice.customer_name}: {invoice.amount}</div>
 *       ))}
 *       <p>Page {data.pagination.page} of {data.pagination.total_pages}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useInvoices(params?: InvoiceFilterParams) {
  return useQuery<InvoiceListResponse>({
    queryKey: ["invoices", params],
    queryFn: () => getInvoices(params),
  });
}
