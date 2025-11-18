import { isAxiosError } from "axios";

/**
 * Extracts error message from various error types
 * Prioritizes FastAPI error details from axios responses
 */
export function getErrorMessage(error: unknown, fallback = "An error occurred"): string {
  if (isAxiosError(error)) {
    // FastAPI returns error details in response.data.detail
    return error.response?.data?.detail || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return fallback;
}