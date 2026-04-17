import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  login: async () => ({ data: null, error: null }),
  signup: async () => ({ data: null, error: null }),
  loginWithGoogle: async () => ({ data: null, error: null }),
  logout: async () => ({ error: null })
});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createMissingConfigError = () =>
    new Error("Supabase is not configured. Please add your Supabase keys.");

  const updateSessionState = (nextSession) => {
    setSession(nextSession);
    setUser(nextSession?.user ?? null);
  };

  useEffect(() => {
    let isMounted = true;

    if (!supabase) {
      updateSessionState(null);
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const initAuth = async () => {
      try {
        const {
          data: { session: currentSession },
          error
        } = await supabase.auth.getSession();

        if (!isMounted) {
          return;
        }

        if (error) {
          updateSessionState(null);
          return;
        }

        updateSessionState(currentSession ?? null);
      } catch (_error) {
        if (!isMounted) {
          return;
        }
        updateSessionState(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) {
        return;
      }
      updateSessionState(newSession ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signup = async ({ email, password }) => {
    if (!supabase) {
      return { data: null, error: createMissingConfigError() };
    }

    return supabase.auth.signUp({
      email,
      password
    });
  };

  const login = async ({ email, password }) => {
    if (!supabase) {
      return { data: null, error: createMissingConfigError() };
    }

    return supabase.auth.signInWithPassword({
      email,
      password
    });
  };

  const loginWithGoogle = async () => {
    if (!supabase) {
      return { data: null, error: createMissingConfigError() };
    }

    return supabase.auth.signInWithOAuth({
      provider: "google"
    });
  };

  const logout = async () => {
    if (!supabase) {
      return { error: createMissingConfigError() };
    }

    return supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, login, signup, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

