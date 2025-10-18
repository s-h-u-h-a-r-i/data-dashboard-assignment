/**
 * Base URL for the backend API.
 *
 * Defaults to `localhost:8080` for local development.
 * Override with `NEXT_PUBLIC_API_BASE_URL` environment variable for other environments.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";

/**
 * Full base URL including API prefix
 */
export const API_URL = `${API_BASE_URL}/api` as const;

/**
 * Default request timeout in milliseconds
 */
export const REQUEST_TIMEOUT = 30000;

/**
 * Default pagination settings
 */
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
