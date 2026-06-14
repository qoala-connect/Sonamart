-- ─── Stonamart Auth Schema ────────────────────────────────────────────────────
-- Run this in the Supabase SQL editor BEFORE starting the app.
--
-- Better Auth requires these four base tables.
-- The user table is extended with role, status, and city fields.
-- Run `npx better-auth generate` for the exact migration for your BA version.

-- ─── Better Auth: user ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "user" (
  "id"            TEXT        PRIMARY KEY,
  "name"          TEXT        NOT NULL,
  "email"         TEXT        NOT NULL UNIQUE,
  "emailVerified" BOOLEAN     NOT NULL DEFAULT FALSE,
  "image"         TEXT,
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Stonamart custom fields
  "role"          TEXT        NOT NULL DEFAULT 'CUSTOMER'  CHECK ("role"   IN ('CUSTOMER','VENDOR','ADMIN')),
  "status"        TEXT        NOT NULL DEFAULT 'ACTIVE'    CHECK ("status" IN ('ACTIVE','PENDING','INACTIVE')),
  "city"          TEXT
);

-- ─── Better Auth: session ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "session" (
  "id"          TEXT        PRIMARY KEY,
  "expiresAt"   TIMESTAMPTZ NOT NULL,
  "token"       TEXT        NOT NULL UNIQUE,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "ipAddress"   TEXT,
  "userAgent"   TEXT,
  "userId"      TEXT        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);

-- ─── Better Auth: account ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "account" (
  "id"                    TEXT        PRIMARY KEY,
  "accountId"             TEXT        NOT NULL,
  "providerId"            TEXT        NOT NULL,
  "userId"                TEXT        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken"           TEXT,
  "refreshToken"          TEXT,
  "idToken"               TEXT,
  "accessTokenExpiresAt"  TIMESTAMPTZ,
  "refreshTokenExpiresAt" TIMESTAMPTZ,
  "scope"                 TEXT,
  "password"              TEXT,
  "createdAt"             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Better Auth: verification ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "verification" (
  "id"         TEXT        PRIMARY KEY,
  "identifier" TEXT        NOT NULL,
  "value"      TEXT        NOT NULL,
  "expiresAt"  TIMESTAMPTZ NOT NULL,
  "createdAt"  TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Stonamart: vendor_profiles ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "vendor_profiles" (
  "id"              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId"          TEXT        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE UNIQUE,
  "companyName"     TEXT        NOT NULL,
  "contactPerson"   TEXT        NOT NULL,
  "phone"           TEXT        NOT NULL,
  "gstNumber"       TEXT,
  "businessAddress" TEXT,
  "city"            TEXT        NOT NULL,
  "documentUrls"    TEXT[]      DEFAULT ARRAY[]::TEXT[],
  "createdAt"       TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Stonamart: guest_inquiries (for guest-to-account linking) ────────────────
CREATE TABLE IF NOT EXISTS "inquiries" (
  "id"         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "email"      TEXT        NOT NULL,
  "user_id"    TEXT        REFERENCES "user"("id") ON DELETE SET NULL,
  "product_id" TEXT,
  "message"    TEXT,
  "city"       TEXT,
  "createdAt"  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Performance indexes ──────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_session_userId    ON "session"("userId");
CREATE INDEX IF NOT EXISTS idx_session_token     ON "session"("token");
CREATE INDEX IF NOT EXISTS idx_account_userId    ON "account"("userId");
CREATE INDEX IF NOT EXISTS idx_user_email        ON "user"("email");
CREATE INDEX IF NOT EXISTS idx_user_role         ON "user"("role");
CREATE INDEX IF NOT EXISTS idx_vendor_userId     ON "vendor_profiles"("userId");
CREATE INDEX IF NOT EXISTS idx_inquiry_email     ON "inquiries"("email");

-- ─── Row-Level Security ───────────────────────────────────────────────────────
-- Better Auth connects via DATABASE_URL (service role) so it bypasses RLS.
-- The Supabase anon/authenticated roles are used for user-facing data ops.

ALTER TABLE "user"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "vendor_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "inquiries"       ENABLE ROW LEVEL SECURITY;

-- Users can read their own record
CREATE POLICY "user: read own" ON "user"
  FOR SELECT USING (auth.uid()::text = id);

-- Users can update their own record (city etc.) but NOT role/status
CREATE POLICY "user: update own (safe fields)" ON "user"
  FOR UPDATE USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

-- Vendors can read/update their own vendor profile
CREATE POLICY "vendor_profiles: owner access" ON "vendor_profiles"
  FOR ALL USING (auth.uid()::text = "userId");

-- Admins have full access (service role bypasses RLS automatically)

-- Inquiries: owners see their own
CREATE POLICY "inquiries: owner access" ON "inquiries"
  FOR SELECT USING (auth.uid()::text = user_id OR email = current_setting('request.jwt.claims', true)::json->>'email');

-- ─── Admin status update function ─────────────────────────────────────────────
-- Called by the admin to activate/suspend vendors.
-- Runs with SECURITY DEFINER to bypass RLS safely.
CREATE OR REPLACE FUNCTION admin_update_vendor_status(
  target_user_id TEXT,
  new_status      TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF new_status NOT IN ('ACTIVE', 'PENDING', 'INACTIVE') THEN
    RAISE EXCEPTION 'Invalid status value: %', new_status;
  END IF;
  UPDATE "user"
  SET    "status" = new_status, "updatedAt" = NOW()
  WHERE  "id" = target_user_id AND "role" = 'VENDOR';
END;
$$;
