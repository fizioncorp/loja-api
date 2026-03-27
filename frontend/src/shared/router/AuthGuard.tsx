import { useEffect, type PropsWithChildren } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "./RouterProvider";
import { LOGIN_PATH } from "./routes";

export function AuthGuard({ children }: PropsWithChildren) {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const { navigate, path, setPostLoginRedirect } = useRouter();

  useEffect(() => {
    if (isBootstrapping || isAuthenticated) {
      return;
    }

    setPostLoginRedirect(path);
    navigate(LOGIN_PATH, { replace: true });
  }, [isAuthenticated, isBootstrapping, navigate, path, setPostLoginRedirect]);

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-200">
        Validando sessao...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
