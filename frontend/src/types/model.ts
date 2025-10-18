// #region Payment Models
/**
 * Enum representing the possible payment statuses.
 */
export enum PaymentStatus {
  /** Payment has been successfully processed and completed */
  PAID = "paid",
  /** Payment is awaiting processing or confirmation */
  PENDING = "pending",
}

/**
 * Represents a payment transaction in the system.
 */
export interface Payment {
  /** Unique identifier for the payment record */
  id: number;
  /** Unique transaction identifier for tracking purposes */
  transaction_id: string;
  /** Payment amount in the specified currency */
  amount: number;
  /** ISO 4217 currency code (e.g., USD, EUR, GBP) */
  currency: string;
  /** Current status of the payment */
  status: PaymentStatus;
  /** Name of the customer who made the payment */
  customer_name: string;
  /** Optional description or notes about the payment */
  description: string | null;
  /** ISO 8601 timestamp when the payment record was created */
  created_at: string;
}
// #endregion Payment Models

// #region Invoice Models
/**
 * Enum representing the possible invoice statuses.
 */
export enum InvoiceStatus {
  /** Invoice has been paid in full */
  PAID = "paid",
  /** Invoice has not been paid yet but is not overdue */
  UNPAID = "unpaid",
  /** Invoice payment is past the due date */
  OVERDUE = "overdue",
}

/**
 * Represents an invoice in the system.
 */
export interface Invoice {
  /** Unique identifier for the invoice record */
  id: number;
  /** Human-readable invoice number for reference */
  invoice_number: string;
  /** Total invoice amount in the specified currency */
  amount: number;
  /** ISO 4217 currency code (e.g., USD, EUR, GBP) */
  currency: string;
  /** Current status of the invoice */
  status: InvoiceStatus;
  /** ISO 8601 date when payment is due */
  due_date: string;
  /** ISO 8601 date when the invoice was issued */
  issue_date: string;
  /** Name of the customer to whom the invoice is addressed */
  customer_name: string;
  /** Optional description or notes about the invoice */
  description: string | null;
  /** ISO 8601 timestamp when the ivnoice record was created */
  created_at: string;
}
// #endregion Invoice Models

// #region Summary Models
/**
 * Represents aggregated data for a specific month.
 */
export interface MonthlyBreakdown {
  /** Month identifier in YYYY-MM format */
  month: string;
  /** Total monetary amount for the month */
  total_amount: number;
  /** Total count of items for the month */
  count: number;
}

/**
 * Represents aggregated summary statistics for payments.
 */
export interface PaymentsSummary {
  /** Total amount across all payments */
  total_amount: number;
  /** Total number of payments */
  total_count: number;
  /** Total amount of payments with PAID status */
  paid_amount: number;
  /** Number of payments with PAID status */
  paid_count: number;
  /** Total amount of payments with PENDING status */
  pending_amount: number;
  /** Number of payments with PENDING status */
  pending_count: number;
  /** Monthly breakdown of payment data */
  monthly_breakdown: MonthlyBreakdown[];
}

/**
 * Represents aggregated summary statistics for invoices.
 */
export interface InvoicesSummary {
  /** Total amount across all invoices */
  total_amount: number;
  /** Total number of invoices */
  total_count: number;
  /** Total amount of invoices with PAID status */
  paid_amount: number;
  /** Number of invoices with PAID status */
  paid_count: number;
  /** Total amount of invoices with UNPAID status */
  unpaid_amount: number;
  /** Number of invoices with UNPAID status */
  unpaid_count: number;
  /** Total amount of invoices with OVERDUE status */
  overdue_amount: number;
  /** Number of invoices with OVERDUE status */
  overdue_count: number;
  /** Monthly breakdown of invoice data */
  monthly_breakdown: MonthlyBreakdown[];
}

/**
 * Represents combined summary metrics for both payments and invoices.
 */
export interface SummaryMetrics {
  /** Aggregated payment statistics */
  payments: PaymentsSummary;
  /** Aggregated invoice statistics */
  invoices: InvoicesSummary;
}
// #endregion Summary Models

// #region AI Assistant Models
/**
 * Represents a conversation exchange with the AI assistant.
 */
export interface AIMessage {
  /** The user's query or question submitted to the AI */
  query: string;
  /** The AI's generated response to the query */
  response: string;
  /** ISO 8601 timestamp when the exchange occurred */
  timestamp: string;
  /** Name or identifier of the AI model used */
  model: string;
  /** Optional token usage statistics for the AI request */
  token_usage?: {
    /** Number of token in the input prompt */
    prompt_tokens?: number;
    /** Number of tokens in the generated completion */
    completion_tokens?: number;
    /** Total tokens used (prompt + completion) */
    total_tokens?: number;
  } | null;
}
// #endregion AI Assistant Models

// #region Logs Models
/**
 * Represents a log entry for an agent/API request.
 */
export interface AgentLog {
  /** ISO 8601 timestamp when the request was made */
  timestamp: string;
  /** API endpoint that was accessed */
  endpoint: string;
  /** HTTP method used for the request (GET, POST, etc.) */
  method: string;
  /** Query parameters or request body sent with the request */
  parameters: Record<string, unknown> | null;
  /** HTTP status code returned by the request */
  status_code: number;
  /** Error message if the request failed, null otherwise */
  error: string | null;
  /** Duration of the request in milliseconds */
  duration_ms: number | null;
}

/**
 * Represents statistics about agent logs and system activity.
 */
export interface LoggerStats {
  /** Total number of log entries recorded */
  total_logs: number;
  /** Number of log entries that represent errors */
  error_count: number;
  /** Number of API requests logged */
  request_count: number;
  /** Number of AI assistant queries logged */
  ai_query_count: number;
}
// #endregion Logs Models
