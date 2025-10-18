import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AssistantResponse } from "@/types/api";

import { queryAIAssistant } from "../api";

/**
 * ### React Query mutation hook for interacting with the AI assistant
 *
 * Provides a mutation function to send queries to the AI assistant,
 * along with loading, error, and success states. Uses optimistic updates
 * for better UX.
 *
 * @returns The React Query mutation result object containing the mutate function,
 * loading state, error, and response data.
 *
 * @example
 * ```tsx
 * function ChatInterface() {
 *   const { mutate, isPending, error, data } = useAIAssistant();
 *   const [query, setQuery] = useState('');
 *
 *   const handleSend = () => {
 *     mutate(query, {
 *       onSuccess: (response) => {
 *         console.log('AI Response:', response.response);
 *         setQuery('');
 *       }
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <input value={query} onChange={(e) => setQuery(e.target.value)} />
 *       <button onClick={handleSend} disabled={isPending}>
 *         {isPending ? 'Sending...' : 'Send'}
 *       </button>
 *       {error && <div>Error: {error.message}</div>}
 *       {data && <div>Response: {data.response}</div>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAIAssistant() {
  const queryClient = useQueryClient();

  return useMutation<AssistantResponse, Error, string>({
    mutationFn: (query: string) => queryAIAssistant(query),
    onSuccess: () => {
      // Invalidate agent logs to refetch after AI query (logs the interaction)
      queryClient.invalidateQueries({ queryKey: ["agent-logs"] });
    },
  });
}
