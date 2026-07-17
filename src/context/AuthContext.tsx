import { createContext, useContext, useEffect, useState } from "react";
import { getLocalSessionId, clearLocalSessionId } from "../lib/session";
import { getActiveSession } from "../lib/session";

import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const checkCurrentSession = async (userId: string) => {
    try {
      const { data, error } = await getActiveSession(userId);

      if (error || !data) return;

      const dbSessionId = data.session_id;
      const localSessionId = getLocalSessionId();

      console.log("Checking Session...");
      console.log("DB:", dbSessionId);
      console.log("LOCAL:", localSessionId);

      // Guard
      if (!localSessionId) return;

      if (dbSessionId !== localSessionId) {
        alert("Your account has been logged in from another device.");

        clearLocalSessionId();

        await supabase.auth.signOut({
          scope: "local",
        });

        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Session Check Error:", err);
    }
  };

  useEffect(() => {
    let sessionCheckInterval: ReturnType<typeof setInterval> | undefined;

    const startPolling = async (userId: string) => {
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
      }

      await checkCurrentSession(userId);

      sessionCheckInterval = setInterval(() => {
        checkCurrentSession(userId);
      }, 5000);
    };

    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      const userId = session?.user?.id;

      if (userId) {
        await startPolling(userId);
      }

      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("AUTH EVENT:", event);

      setSession(session);

      const userId = session?.user?.id;

      if (userId) {
        startPolling(userId);
      } else {
        if (sessionCheckInterval) {
          clearInterval(sessionCheckInterval);
          sessionCheckInterval = undefined;
        }
      }
    });

    const handleFocus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session?.user?.id) {
        await checkCurrentSession(session.user.id);
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      subscription.unsubscribe();

      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
      }

      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components, react/only-export-components
export const useAuth = () => useContext(AuthContext);
