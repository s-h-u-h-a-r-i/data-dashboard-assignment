import { useQuery } from "@tanstack/react-query";

import { AgentLogsFilterParams, AgentLogsResponse } from "@/types/api";

import { getAgentLogs } from "../api";

/**
 * ### React Query hook for fetching agent activity logs
 *
 * Provides automatic caching, background refetching, and loading/error states
 * for agent logs data. Supports filtering by limit and log type.
 *
 * @param params Optional filter parameters
 * @returns The React Query result object containing agent logs data,
 * loading and error state, etc.
 *
 * @example
 * ```tsx
 * function AgentLogsPanel() {
 *   const { data, isLoading, error } = useAgentLogs({ limit: 50 });
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       <p>Total Logs: {data.total_count}</p>
 *       {data.logs.map((log, idx) => (
 *         <div key={idx}>{log.endpoint} - {log.status_code}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAgentLogs(params?: AgentLogsFilterParams) {
  return useQuery<AgentLogsResponse>({
    queryKey: ["agent-logs", params],
    queryFn: () => getAgentLogs(params),
  });
}
