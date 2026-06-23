import { createClient } from "@supabase/supabase-js";

/**
 * Derives the Supabase project URL from DATABASE_URL.
 * DATABASE_URL pooler format: postgresql://postgres.<ref>:<pwd>@<host>:6543/postgres
 * Falls back to NEXT_PUBLIC_SUPABASE_URL if set.
 */
function getSupabaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (explicit) return explicit;

  const dbUrl = process.env.DATABASE_URL ?? "";
  // Match postgres.<project-ref>: in the URL
  const match = dbUrl.match(/postgres\.([^:@]+)[^@]*@/);
  if (match) {
    return `https://${match[1]}.supabase.co`;
  }
  throw new Error(
    "Cannot determine Supabase URL. Set NEXT_PUBLIC_SUPABASE_URL or DATABASE_URL."
  );
}

/**
 * Server-side Supabase admin client using service role key.
 * Bypasses RLS — only use in server-side code (API routes, Server Components).
 */
export function getServerSupabase() {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set.");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
