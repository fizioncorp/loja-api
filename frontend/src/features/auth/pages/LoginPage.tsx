import { useEffect, useState } from "react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { useRouter } from "@/shared/router/RouterProvider";
import { DEFAULT_AUTH_PATH } from "@/shared/router/routes";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const { signIn, isSigningIn, isAuthenticated } = useAuth();
  const { consumePostLoginRedirect, navigate } = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const redirectTo = consumePostLoginRedirect() ?? DEFAULT_AUTH_PATH;
    navigate(redirectTo, { replace: true });
  }, [consumePostLoginRedirect, isAuthenticated, navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    const success = await signIn(email, password);

    if (success) {
      const redirectTo = consumePostLoginRedirect() ?? DEFAULT_AUTH_PATH;
      navigate(redirectTo, { replace: true });
      return;
    }

    setErrorMessage("Nao foi possivel entrar. Confira email e senha.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl"
      >
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-300">
            Loja API
          </p>
          <h1 className="text-2xl font-semibold text-white">Entrar no sistema</h1>
          <p className="text-sm text-slate-400">
            A autenticacao agora preserva a rota desejada e libera a area protegida.
          </p>
        </div>

        <Input
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          autoComplete="current-password"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {errorMessage}
          </div>
        ) : null}

        <Button type="submit" disabled={isSigningIn}>
          {isSigningIn ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
