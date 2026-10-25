import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Cache client instances
let serverAdminClient: SupabaseClient | null = null;
let publicClient: SupabaseClient | null = null;

function getResolvedSupabaseUrl(): string | undefined {
  return (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_SUPABASE_URL
  );
}

function getResolvedServiceRoleKey(): string | undefined {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_SUPABASE_ANON_KEY
  );
}

function getResolvedAnonKey(): string | undefined {
  return (
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/**
 * Returns true if the database credentials are validly configured in environment
 */
export function isDatabaseConfigured(): boolean {
  const url = getResolvedSupabaseUrl();
  const key = getResolvedServiceRoleKey() || getResolvedAnonKey();
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

  const url = getResolvedSupabaseUrl()!;
  const serviceKey = (getResolvedServiceRoleKey() || getResolvedAnonKey())!;

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

  const url = getResolvedSupabaseUrl()!;
  const anonKey = (getResolvedAnonKey() || getResolvedServiceRoleKey())!;

  if (!publicClient) {
    publicClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  return publicClient;
}
