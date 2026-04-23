import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { authBypassEnabled, supabase } from "@/lib/supabase";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!authBypassEnabled);

  useEffect(() => {
    if (authBypassEnabled) {
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black stickman-grid flex items-center justify-center">
        <p className="text-sm text-black/40">Loading...</p>
      </div>
    );
  }

  if (!authBypassEnabled && !session) return <Navigate to="/" replace />;

  return children;
}
