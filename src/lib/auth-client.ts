import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

const isProduction = process.env.NODE_ENV === "production";

const resolvedAppUrl = isProduction
  ? process.env.NEXT_PUBLIC_APP_URL_PROD ??
    process.env.BETTER_AUTH_URL_PROD ??
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : undefined) ??
    "https://sonamart.vercel.app"
  : process.env.NEXT_PUBLIC_APP_URL ??
    process.env.BETTER_AUTH_URL ??
    "http://127.0.0.1:3000";

// ─── Better Auth client ───────────────────────────────────────────────────────
// Used in Client Components for reactive auth state and mutations.
export const authClient = createAuthClient({
  baseURL: resolvedAppUrl,
  plugins: [inferAdditionalFields<typeof auth>()],
});

export type ClientSession = Awaited<ReturnType<typeof authClient.getSession>>;
