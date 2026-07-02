/**
 * Resolves the base URL for the application.
 * This is crucial for server-side actions, auth callbacks, and email links.
 * It prioritizes an explicit production URL, then falls back to Vercel's
 * system environment variables, and finally to a local development URL.
 */
export function getBaseUrl() {
  // 1. Explicitly set production URL from environment
  if (process.env.NEXT_PUBLIC_APP_URL_PROD) {
    return process.env.NEXT_PUBLIC_APP_URL_PROD;
  }
  // 2. Vercel deployment URL (works for both production and preview)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // 3. Fallback for local development
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}