import { APIError } from "@/types/api";
import * as apiConfig from "./config";

/**
 * Parameters for making an API request.
 */
interface RequestParams {
  /** The API endpoint (relative to the base URL) to send the request to. */
  endpoint: string;
  /** Optional query parameters to append to the endpoint URL. */
  params?: object;
  /** Optional request payload (for POST/PUT/PATCH methods). */
  body?: unknown;
  /** Optional custom fetch options (headers, method, etc.). */
  options?: RequestInit;
}

/**
 * ### Custom error class for API client operations.
 *
 * Extends the standard Error class to provide additional context about API failures,
 * including HTTP status codes and detailed error information from the server.
 *
 * @example
 * ```typescript
 * try {
 *   await apiClient.get('/payments');
 * } catch (error) {
 *   if (error instanceof APIClientError) {
 *     console.log(`API Error ${error.statusCode}: ${error.message}`);
 *     console.log('Details:', error.details);
 *   }
 * }
 * ```
 */
class APIClientError extends Error {
  /**
   * Creates a new APIClientError instance.
   *
   * @param message Human-readable error message describing what went wrong
   * @param statusCode HTTP status code returned by the server (e.g., 404, 500)
   * @param details Additional error details or context from the server response
   */
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "APIClientError";
  }
}

/**
 * ### Creates an AbortSignal that automatically triggers after a specified timeout.
 *
 * @param timeoutMs The number of milliseconds until the signal is aborted.
 * @returns An AbortSignal that will be aborted after the specified timeout.
 *
 * @example
 * const signal = createTimeoutSignal(5000); // Signal aborts in 5 seconds
 * fetch(url, { signal }).catch((e) => {
 *   if (e.name === 'AbortError') {
 *     console.log('Request timed out.');
 *   }
 * });
 */
function createTimeoutSignal(timeoutMs: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
}

/**
 * ### HTTP client for making API requests to the backend.
 *
 * Provides a type-safe interface for making RESTful API calls with built-in error
 * handling, timeout management, and automatic JSON serialization/deserialization.
 *
 * **Features**:
 * - Automatic request timeout handling
 * - Type-safe response parsing
 * - Consistent error handling via APIClientError
 * - Query parameter serialization (including arrays)
 * - JSON request/response bodies
 *
 * @example
 * ```typescript
 * // Using the default client instance
 * type PaymentQuery = { status?: string; limit?: number };
 * const payments = await apiClient.get<Payment[], PaymentQuery>('/payments', {
 *   status: 'completed',
 *   limit: 10,
 * });
 *
 * // Creating a custom client instance
 * type InvoicePayload = { amount: number; customer: string };
 * const customClient = new APIClient('https://www.example.com/api', 10000);
 * const data = await customClient.post<Invoice, InvoicePayload>('/invoices', {
 *   amount: 100,
 *   customer: 'John Doe',
 * });
 * ```
 */
class APIClient {
  /** Base URL for all API requests */
  #baseURL: string;
  /** Default timeout in milliseconds for requests */
  #timeout: number;

  /**
   * Creates a new APIClient instance.
   *
   * @param baseURL The base URL for all API requests (default: from config)
   * @param timeout Default request timeout in milliseconds (default: from config)
   */
  constructor(
    baseURL: string = apiConfig.API_URL,
    timeout: number = apiConfig.REQUEST_TIMEOUT
  ) {
    this.#baseURL = baseURL;
    this.#timeout = timeout;
  }

  /**
   * ### Performs a GET request to the specified endpoint.
   *
   * @template T The expected response type.
   * @template U The type of the query parameter object (should be a record/object shape).
   * @param endpoint The API endpoint path (e.g., '/payments').
   * @param params Optional query parameters to append to the URL (type U).
   * @param options Optional fetch API request options (headers, signal, etc.).
   * @returns Promise resolving to the parsed response of type T.
   * @throws {APIClientError} When the request fails or times out.
   *
   * @example
   * ```typescript
   * // Simple GET request
   * const payments = await apiClient.get<Payment[]>('/payments');
   *
   * // GET with query parameters (U is inferred)
   * const filtered = await apiClient.get<Payment[], { status?: string; limit?: number }>(
   *   '/payments',
   *   { status: 'completed', limit: 10 }
   * );
   *
   * // GET with custom headers (no query parameters, so U can be omitted)
   * const data = await apiClient.get<Data>(
   *   '/data',
   *   undefined,
   *   { headers: { 'Authorization': 'Bearer token' } }
   * );
   * ```
   */
  async get<T, U extends object = Record<string, unknown>>(
    endpoint: string,
    params?: U,
    options?: RequestInit
  ): Promise<T> {
    return this.#request<T>("GET", { endpoint, params, options });
  }

  /**
   * ### Performs a POST request to the specified endpoint.
   *
   * @template T The expected response type.
   * @template U The type of the request body (defaults to unknown).
   * @param endpoint The API endpoint path (e.g., '/payments').
   * @param body Optional request payload to send (type U).
   * @param options Optional fetch API request options (headers, signal, etc.).
   * @returns Promise resolving to the parsed response of type T.
   * @throws {APIClientError} When the request fails or times out.
   *
   * @example
   * ```typescript
   * const created = await apiClient.post<MyResponseType, MyRequestBodyType>(
   *   '/create',
   *   { name: 'test' }
   * );
   * ```
   */
  async post<T, U = unknown>(
    endpoint: string,
    body?: U,
    options?: RequestInit
  ): Promise<T> {
    return this.#request<T>("POST", { endpoint, body, options });
  }

  /**
   * ### Performs a PUT request to the specified endpoint.
   *
   * @template T The expected response type.
   * @template U The type of the request body (defaults to unknown).
   * @param endpoint The API endpoint path (e.g., '/payments/123').
   * @param body Optional request payload to send (type U).
   * @param options Optional fetch API request options (headers, signal, etc.).
   * @returns Promise resolving to the parsed response of type T.
   * @throws {APIClientError} When the request fails or times out.
   *
   * @example
   * ```typescript
   * await apiClient.put<MyResponseType, MyRequestBodyType>(
   *   '/payments/123',
   *   { amount: 100 }
   * );
   * ```
   */
  async put<T, U = unknown>(
    endpoint: string,
    body?: U,
    options?: RequestInit
  ): Promise<T> {
    return this.#request<T>("PUT", { endpoint, body, options });
  }

  /**
   * ### Performs a DELETE request to the specified endpoint.
   *
   * @template T The expected response type.
   * @param endpoint The API endpoint path (e.g., '/payments/123').
   * @param options Optional fetch API request options (headers, signal, etc.).
   * @returns Promise resolving to the parsed response of type T.
   * @throws {APIClientError} When the request fails or times out.
   *
   * @example
   * ```typescript
   * await apiClient.delete<void>('/payments/123');
   * ```
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.#request<T>("DELETE", { endpoint, options });
  }

  /**
   * ### Internal utility for making an HTTP request.
   *
   * **Orchestrates the entire request lifecycle including**:
   * - URL construction with query parameters
   * - Request body serialization
   * - Timeout signal creation
   * - Response handling and parsing
   * - Error handling and transormation
   *
   * @template T The expected response type.
   * @param method The HTTP method (`"GET"`, `"POST"`, `"PUT"`, or `"DELETE"`).
   * @param paramsObj The request configuration object.
   * @throws {APIClientError} If the network request fails, times out, or the response is not OK.
   */
  async #request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    paramsObj: RequestParams
  ): Promise<T> {
    const { endpoint, params, body, options } = paramsObj;
    const url = this.#buildURL(endpoint, params);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: options?.signal || createTimeoutSignal(this.#timeout),
        ...options,
      });

      return await this.#handleResponse<T>(response);
    } catch (error) {
      this.#handleError(error);
    }
  }

  /**
   * ### Constructs a full URL with query paramters.
   *
   * **Handles URL construction including**:
   * - Combining base URL with endpoint path
   * - Serializing query parameters
   * - Supporting array parameters (each value appended separately)
   * - Filtering out null and undefined values
   *
   * @param endpoint The API endpoint path
   * @param params Optional query paramters to serialize
   * @returns The complete URL with query string
   *
   * @example
   * ```typescript
   * // Single values
   * buildURL('/payments', { status: 'completed' })
   * // => 'http://www.example.com/api/payments?status=completed'
   *
   * //Array values
   * buildURL('/data', { ids: [1, 2, 3] })
   * // => 'http://www.example.com/api/data?ids=1&ids=2&ids=3'
   * ```
   */
  #buildURL(endpoint: string, params?: object): string {
    const url = new URL(`${this.#baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => url.searchParams.append(key, String(v)));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    return url.toString();
  }

  /**
   * ### Handles HTTP response parsing and error checking.
   *
   * **Processing the fetch response by**:
   * - Checking HTTP status codes
   * - Parsing error responses from the server
   * - Extracting and parsing JSON response bodies
   * - Throwing appropriately typed errors for failures
   *
   * @template T The expected response type
   * @param response The fetch response object
   * @returns Promise resolving to the parsed response of type T
   * @throws {APIClientError} When respones status is not ok or JSON parsing fails
   */
  async #handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorDetails: APIError | undefined;

      try {
        const errorData: APIError = await response.json();
        errorMessage = errorData.detail || errorMessage;
        errorDetails = errorData;
      } catch {
        // Parsing error repsonse failed, using default message
      }

      throw new APIClientError(errorMessage, response.status, errorDetails);
    }

    try {
      return await response.json();
    } catch (error) {
      throw new APIClientError(
        "Failed to parse response JSON",
        response.status,
        error
      );
    }
  }

  /**
   * ### Handles and transforms errors into APIClientError instances.
   *
   * **Catches various error types and normalizes them**:
   * - APIClientError: re-thrown as-is
   * - AbortError: transformed to timeout error
   * - Other Error instances: wrapped with network error message
   * - Unknown errors: wrapped with generic error message
   *
   * @param error The error caught during request execution
   * @throws {APIClientError} Always throws with appropriate error details
   */
  #handleError(error: unknown): never {
    if (error instanceof APIClientError) throw error;

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new APIClientError("Request timeotu", undefined, error);
      }

      throw new APIClientError(
        `Network error: ${error.message}`,
        undefined,
        error
      );
    }

    throw new APIClientError("Unknown error occurred", undefined, error);
  }
}

/**
 * ### Default API client instance for making requests to the backend.
 *
 * This is a pre-configured singleton instance using the default API URL and timeout
 * from the config module.
 *
 * @example
 * ```typescript
 * import { apiClient } from '@/lib/api/client';
 *
 * const payments = await apiClient.get<Payment[]>('/payments');
 * ```
 */
const apiClient = new APIClient();

export { type APIClient, apiClient, APIClientError };
