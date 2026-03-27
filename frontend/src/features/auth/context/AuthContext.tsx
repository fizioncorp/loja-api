import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { AuthSession } from "@/types/auth";
import { login } from "../services/authService";
import {
  clearStoredSession,
  createSession,
  getStoredSession,
  onUnauthorized,
  persistSession,
} from "../utils/session";

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  isSigningIn: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    setSession(getStoredSession());
    setIsBootstrapping(false);
  }, []);

  useEffect(() => {
    return onUnauthorized(() => {
      clearStoredSession();
      setSession(null);
    });
  }, []);

  async function signIn(email: string, password: string) {
    try {
      setIsSigningIn(true);

      const { token } = await login({ email, password });
      const nextSession = createSession(token);

      if (!nextSession) {
        clearStoredSession();
        setSession(null);
        return false;
      }

      persistSession(token);
      setSession(nextSession);
      return true;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    } finally {
      setIsSigningIn(false);
    }
  }

  function signOut() {
    clearStoredSession();
    setSession(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      isBootstrapping,
      isSigningIn,
      signIn,
      signOut,
    }),
    [isBootstrapping, isSigningIn, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
}
