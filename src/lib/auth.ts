import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";
import { getBaseUrl } from "./config";

const resolvedAppUrl = getBaseUrl();
// Set the base URL for better-auth to use internally
process.env.BETTER_AUTH_URL = resolvedAppUrl;

// ─── Better Auth server configuration ────────────────────────────────────────
export const auth = betterAuth({
  database: db,
  baseURL: resolvedAppUrl,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "CUSTOMER",
        input: true,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: "ACTIVE",
        input: false, // cannot be set by the user during registration
      },
      city: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // refresh if older than 1 day
  },

  plugins: [nextCookies()],

  // Use a Set to ensure unique origins. This handles the case where resolvedAppUrl
  // might be localhost, and also keeps the list clean.
  trustedOrigins: [...new Set([resolvedAppUrl, "http://localhost:3000"])],
});

// ─── Inferred types ───────────────────────────────────────────────────────────
export type AuthSession = typeof auth.$Infer.Session;
export type AuthUser = typeof auth.$Infer.Session.user & {
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  city?: string;
};
