import type { PropsWithChildren } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/components/Button";
import { useRouter } from "@/shared/router/RouterProvider";
import { DEFAULT_AUTH_PATH, LOGIN_PATH, navigationItems, type ProtectedPath } from "@/shared/router/routes";

function NavItem({
  isActive,
  label,
  path,
  onClick,
}: {
  isActive: boolean;
  label: string;
  path: ProtectedPath;
  onClick: (path: ProtectedPath) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(path)}
      className={`rounded-2xl border px-4 py-3 text-left transition ${
        isActive
          ? "border-sky-400 bg-sky-500/20 text-white"
          : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
      }`}
    >
      <div className="text-sm font-semibold">{label}</div>
      <div className="mt-1 text-xs text-slate-400">
        {navigationItems.find((item) => item.path === path)?.description}
      </div>
    </button>
  );
}

export function AppShell({ children }: PropsWithChildren) {
  const { session, signOut } = useAuth();
  const { navigate, path } = useRouter();

  function handleNavigate(nextPath: ProtectedPath) {
    navigate(nextPath);
  }

  function handleSignOut() {
    signOut();
    navigate(LOGIN_PATH, { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
        <aside className="w-full rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-80">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              Loja API
            </p>
            <h1 className="text-2xl font-semibold">Base do sistema</h1>
            <p className="text-sm text-slate-400">
              Navegacao inicial para organizarmos as proximas features.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sessao</p>
            <p className="mt-2 text-sm font-medium text-white">{session?.user.role}</p>
            <p className="text-sm text-slate-400">Loja {session?.user.storeId}</p>
            <p className="text-xs text-slate-500">Usuario {session?.user.userId}</p>
          </div>

          <nav className="mt-6 grid gap-3">
            {navigationItems.map((item) => (
              <NavItem
                key={item.path}
                isActive={path === item.path || (path === DEFAULT_AUTH_PATH && item.path === DEFAULT_AUTH_PATH)}
                label={item.label}
                path={item.path}
                onClick={handleNavigate}
              />
            ))}
          </nav>

          <div className="mt-6">
            <Button type="button" onClick={handleSignOut}>
              Sair
            </Button>
          </div>
        </aside>

        <main className="flex-1 rounded-3xl border border-slate-800 bg-slate-900/40 p-5 shadow-2xl lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
