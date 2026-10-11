import { createClient } from "@supabase/supabase-js";

// Nur auf dem Server verwenden: der Secret-Key umgeht Row Level Security.
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
