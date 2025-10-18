import {
  AgentLogsFilterParams,
  AgentLogsResponse,
  AssistantRequest,
  AssistantResponse,
  InvoiceFilterParams,
  InvoiceListResponse,
  LoggerStatsResponse,
  PaymentFilterParams,
  PaymentListResponse,
  SummaryResponse,
} from "@/types/api";
import { apiClient } from "./client";

// #region Payments API
/**
 * Fetches a list of payments from the API.
 *
 * @param params Optional filter, pagination, or search parameters.
 * @returns Promise resolving to the payments list response.
 */
export async function getPayments(
  params?: PaymentFilterParams
): Promise<PaymentListResponse> {
  return apiClient.get<PaymentListResponse, PaymentFilterParams>(
    "/payments",
    params
  );
}
// #endregion Payments API

// #region Invoices API
/**
 * Fetches a list of invoices from the API.
 *
 * @param params Optional filter, pagination, or search parameters.
 * @returns Promise resolving to the invoices list response.
 */
export async function getInvoices(
  params?: InvoiceFilterParams
): Promise<InvoiceListResponse> {
  return apiClient.get<InvoiceListResponse, InvoiceFilterParams>(
    "/invoices",
    params
  );
}
// #endregion Invoices API

// #region Summary API
/**
 * Fetches a summary from the API dashboard.
 *
 * @returns Promise resolving to the summary response.
 */
export async function getSummary(): Promise<SummaryResponse> {
  return apiClient.get<SummaryResponse>("/summary");
}
// #endregion Summary API

// #region AI Assistant API
/**
 * Sends a query to the AI assistant endpoint and returns the assistant's response.
 *
 * @param {string} query - The query or prompt for the AI assistant.
 * @returns {Promise<AssistantResponse>} Promise resolving to the assistant's response.
 */
export async function queryAIAssistant(
  query: string
): Promise<AssistantResponse> {
  return apiClient.post<AssistantResponse, AssistantRequest>("/ai-assistant", {
    query,
  });
}
// #endregion AI Assistant API

// #region Agent Logs API
/**
 * Fetches agent logs with optional filtering parameters.
 *
 * @param params Optional filter or pagination parameters for agent logs.
 * @returns Promise resolving to the agent logs response.
 */
export async function getAgentLogs(
  params?: AgentLogsFilterParams
): Promise<AgentLogsResponse> {
  return apiClient.get<AgentLogsResponse, AgentLogsFilterParams>(
    "/agent-logs",
    params
  );
}

/**
 * Fetches logger statistics from the agent logs.
 *
 * @returns Promise resolving to the logger statistics response.
 */
export async function getLoggerStats(): Promise<LoggerStatsResponse> {
  return apiClient.get<LoggerStatsResponse>("/agent-logs/stats");
}
// #endregion Agent Logs API
