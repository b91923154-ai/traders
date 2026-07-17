import { supabase } from "./supabase";

/**
 * Generate unique session id
 */
export const generateSessionId = () => {
  return crypto.randomUUID();
};

/**
 * Save current session locally
 */
export const saveLocalSessionId = (sessionId: string) => {
  localStorage.setItem("session_id", sessionId);
};

/**
 * Read current local session
 */
export const getLocalSessionId = () => {
  return localStorage.getItem("session_id");
};

/**
 * Remove local session
 */
export const clearLocalSessionId = () => {
  localStorage.removeItem("session_id");
};

/**
 * Save active session into Supabase
 */
export const saveActiveSession = async (
  userId: string,
  sessionId: string
) => {
  const { error } = await supabase
    .from("active_sessions")
    .upsert(
      {
        user_id: userId,
        session_id: sessionId,
        device_name: navigator.userAgent,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

  if (error) throw error;
};

/**
 * Read active session from DB
 */
export const getActiveSession = async (userId: string) => {
  return await supabase
    .from("active_sessions")
    .select("*")
    .eq("user_id", userId)
    .single();
};