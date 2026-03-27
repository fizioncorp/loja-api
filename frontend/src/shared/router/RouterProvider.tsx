import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { DEFAULT_AUTH_PATH, LOGIN_PATH, REDIRECT_STORAGE_KEY, normalizePath, type AppPath } from "./routes";

interface NavigateOptions {
  replace?: boolean;
}

interface RouterContextValue {
  path: AppPath;
  navigate: (path: AppPath, options?: NavigateOptions) => void;
  setPostLoginRedirect: (path: AppPath) => void;
  consumePostLoginRedirect: () => AppPath | null;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function getCurrentPath(): AppPath {
  return normalizePath(window.location.pathname);
}

export function RouterProvider({ children }: PropsWithChildren) {
  const [path, setPath] = useState<AppPath>(getCurrentPath);

  useEffect(() => {
    const syncPath = () => {
      setPath(getCurrentPath());
    };

    window.addEventListener("popstate", syncPath);

    return () => {
      window.removeEventListener("popstate", syncPath);
    };
  }, []);

  function navigate(nextPath: AppPath, options?: NavigateOptions) {
    const normalized = normalizePath(nextPath);
    const method = options?.replace ? "replaceState" : "pushState";

    window.history[method](null, "", normalized);
    setPath(normalized);
  }

  function setPostLoginRedirect(nextPath: AppPath) {
    if (nextPath === LOGIN_PATH) {
      sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
      return;
    }

    sessionStorage.setItem(REDIRECT_STORAGE_KEY, nextPath);
  }

  function consumePostLoginRedirect() {
    const stored = sessionStorage.getItem(REDIRECT_STORAGE_KEY);
    sessionStorage.removeItem(REDIRECT_STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const normalized = normalizePath(stored);
    return normalized === LOGIN_PATH ? DEFAULT_AUTH_PATH : normalized;
  }

  const value = useMemo<RouterContextValue>(
    () => ({
      path,
      navigate,
      setPostLoginRedirect,
      consumePostLoginRedirect,
    }),
    [path],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const context = useContext(RouterContext);

  if (!context) {
    throw new Error("useRouter must be used within RouterProvider");
  }

  return context;
}
