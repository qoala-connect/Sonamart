import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

// ─── Better Auth client ───────────────────────────────────────────────────────
// Used in Client Components for reactive auth state and mutations.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  plugins: [inferAdditionalFields<typeof auth>()],
});

export type ClientSession = Awaited<ReturnType<typeof authClient.getSession>>;
