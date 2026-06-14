import { createClient } from "@supabase/supabase-js";

// Use placeholder URLs during build time when env vars are absent.
// Actual API calls are only made at request time (after env vars are loaded).
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://placeholder.supabase.co";
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder";
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder";

// ─── Supabase admin client (service role — bypasses RLS) ─────────────────────
// Used in Server Actions and Route Handlers for privileged operations:
// updating vendor status, reading all user records, etc.
// Never expose this client to the browser.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

// ─── Supabase anon client (browser-safe, respects RLS) ───────────────────────
export const supabaseAnon = createClient(supabaseUrl, anonKey);

export type VendorProfile = {
  id: string;
  userId: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  gstNumber?: string;
  businessAddress: string;
  city: string;
  documentUrls: string[];
  createdAt: string;
  updatedAt: string;
};
