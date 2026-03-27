import type { AuthSession, AuthUser } from "@/types/auth";

const AUTH_STORAGE_KEY = "auth:session";
const AUTH_UNAUTHORIZED_EVENT = "auth:unauthorized";

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  return window.atob(padded);
}

function parseToken(token: string): AuthUser | null {
  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    const decoded = JSON.parse(decodeBase64Url(payload)) as AuthUser;

    if (!decoded.userId || !decoded.storeId || !decoded.role) {
      return null;
    }

    if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export function createSession(token: string): AuthSession | null {
  const user = parseToken(token);

  if (!user) {
    return null;
  }

  return { token, user };
}

export function getStoredSession(): AuthSession | null {
  const token = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!token) {
    return null;
  }

  const session = createSession(token);

  if (!session) {
    clearStoredSession();
    return null;
  }

  return session;
}

export function persistSession(token: string) {
  localStorage.setItem(AUTH_STORAGE_KEY, token);
}

export function clearStoredSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getStoredToken() {
  return localStorage.getItem(AUTH_STORAGE_KEY);
}

export function notifyUnauthorized() {
  window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
}

export function onUnauthorized(handler: () => void) {
  window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handler);

  return () => {
    window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handler);
  };
}
