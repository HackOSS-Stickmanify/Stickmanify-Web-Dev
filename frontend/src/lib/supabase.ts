import { createClient, type Session } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://example.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "missing-key";

export const authBypassEnabled = import.meta.env.VITE_AUTH_BYPASS === "true";

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getSupabaseSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getAccessToken(): Promise<string> {
  if (authBypassEnabled) {
    throw new Error("Auth bypass is enabled, so backend calls that require a JWT are disabled.");
  }

  const session = await getSupabaseSession();
  if (!session?.access_token) throw new Error("Please log in again.");
  return session.access_token;
}

export function getRoleFromSession(session: Session | null): string | null {
  const role = session?.user.app_metadata?.user_role;
  return typeof role === "string" ? role : null;
}
