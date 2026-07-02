/**
 * Resolves the base URL for the application.
 * This is crucial for server-side actions, auth callbacks, and email links.
 * It prioritizes an explicit production URL, then falls back to Vercel's
 * system environment variables, and finally to a local development URL.
 */
export function getBaseUrl() {
  // 1. Use the production URL if this is the production environment on Vercel.
  // This is for custom domains.
  if (process.env.VERCEL_ENV === "production" && process.env.NEXT_PUBLIC_APP_URL_PROD) {
    return process.env.NEXT_PUBLIC_APP_URL_PROD;
  }

  // 2. Vercel deployment URL (works for preview and development deployments on Vercel)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3. Fallback for local development
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}