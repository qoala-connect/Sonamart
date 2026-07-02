import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";
import { getBaseUrl } from "./config";

// ─── Better Auth client ───────────────────────────────────────────────────────
// Used in Client Components for reactive auth state and mutations.
export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [inferAdditionalFields<typeof auth>()],
});

export type ClientSession = Awaited<ReturnType<typeof authClient.getSession>>;
