import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Cache client instances
let serverAdminClient: SupabaseClient | null = null;
let publicClient: SupabaseClient | null = null;

/**
 * Returns true if the database credentials are validly configured in environment
 */
export function isDatabaseConfigured(): boolean {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && url.startsWith('http') && !url.includes('placeholder'));
}

/**
 * Server-side Admin Client with elevated privileges (service role).
 * Use strictly in Server Actions, Route Handlers, or SSR where caller is authenticated.
 */
export function getAdminDb(): SupabaseClient | null {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)!;
  const serviceKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )!;

  if (!serverAdminClient) {
    serverAdminClient = createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return serverAdminClient;
}

/**
 * Public client for read queries respecting RLS
 */
export function getPublicDb(): SupabaseClient | null {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)!;
  const anonKey = (
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )!;

  if (!publicClient) {
    publicClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  return publicClient;
}
