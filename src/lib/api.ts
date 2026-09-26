/**
 * Utility helper to resolve the backend API URL.
 * Supports production environment variable `NEXT_PUBLIC_API_URL` or `INTERNAL_API_URL`,
 * with fallback to local FastAPI development server `http://127.0.0.1:8000`.
 */
export function getBackendUrl(): string {
  const url =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";
  return url.replace(/\/$/, "");
}
