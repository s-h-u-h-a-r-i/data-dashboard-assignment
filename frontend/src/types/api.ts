import {
  AgentLog,
  AIMessage,
  Invoice,
  InvoiceStatus,
  LoggerStats,
  Payment,
  PaymentStatus,
  SummaryMetrics,
} from "./model";

// #region Pagination Types
/**
 * Metadata about pagination for API responses.
 */
export interface PaginationMetadata {
  /** Current page number (1-based) */
  page: number;
  /** Number of items per page */
  page_size: number;
  /** Total number of items across all pages */
  total_items: number;
  /** Total number of pages available */
  total_pages: number;
}

/**
 * Generic paginated response wrapper for API endpoints.
 * @template T The type of items being paginated
 */
export interface PaginatedResponse<T> {
  /** Array of items for the current page */
  items: T[];
  /** Pagination metadata */
  pagination: PaginationMetadata;
}
// #endregion Pagination Types

// #region Payment API Types
/**
 * Filter parameters for payment list API requests.
 */
export interface PaymentFilterParams {
  /** Page number to retrieve (1-based) */
  page?: number;
  /** Number of items per page */
  page_size?: number;
  /** Filter by payment status */
  status?: PaymentStatus;
  /** Start date for filtering (ISO 8601 format) */
  start_date?: string;
  /** End date for filtering (ISO 8601 format) */
  end_date?: string;
}

/**
 * Response type for payment list API endpoints.
 */
export type PaymentListResponse = PaginatedResponse<Payment>;
// #endregion Payment API Types

// #region Invoice API Types
/**
 * Filter parameters for invoice list API requests.
 */
export interface InvoiceFilterParams {
  /** Page number to retrieve (1-based) */
  page?: number;
  /** Number of items per page */
  page_size?: number;
  /** Filter by invoice status */
  status?: InvoiceStatus;
  /** Start date for filtering (ISO 8601 format) */
  start_date?: string;
  /** End date for filtering (ISO 8601 format) */
  end_date?: string;
}

/**
 * Response type for invoice list API endpoints.
 */
export type InvoiceListResponse = PaginatedResponse<Invoice>;
// #endregion Invoice API Types

// #region Summary API Types
/**
 * Response type for summary metrics API endpoints.
 */
export type SummaryResponse = SummaryMetrics;
// #endregion Summary API Types

// #region AI Assistant API Types
/**
 * Request payload for AI assistant query API.
 */
export interface AssistantRequest {
  /** The user's query or question */
  query: string;
}

/**
 * Response type for AI assistant query API.
 */
export type AssistantResponse = AIMessage;
// #endregion AI Assistant API Types

// #region Agent Logs API Types
/**
 * Filter parameters for agent logs API requests.
 */
export interface AgentLogsFilterParams {
  /** Maximum number of logs to return */
  limit?: number;
  /** Type of logs to filter by */
  log_type?: string;
}

/**
 * Response from agent logs API endpoints.
 */
export interface AgentLogsResponse {
  /** Array of log entries */
  logs: AgentLog[];
  /** Total number of logs available */
  total_count: number;
}

/**
 * Response type for logger statistics API endpoints.
 */
export type LoggerStatsResponse = LoggerStats;
// #endregion Agent Logs API Types

// #region Error Response Types
/**
 * Standard error response format for API endpoints.
 */
export interface APIError {
  /** Human-readable error message */
  detail: string;
  /** HTTP status code (optional) */
  status_code?: number;
}
// #endregion Error Response Types
