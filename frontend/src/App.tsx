import { AuthProvider } from "./features/auth/context/AuthContext";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { AppShell } from "./features/navigation/components/AppShell";
import { CashPage } from "./features/navigation/pages/CashPage";
import { DashboardPage } from "./features/navigation/pages/DashboardPage";
import { ProductsPage } from "./features/products/pages/ProductsPage";
import { SalesPage } from "./features/navigation/pages/SalesPage";
import { StockPage } from "./features/navigation/pages/StockPage";
import { AuthGuard } from "./shared/router/AuthGuard";
import { RouterProvider, useRouter } from "./shared/router/RouterProvider";
import { LOGIN_PATH } from "./shared/router/routes";

function AppRoutes() {
  const { path } = useRouter();

  if (path === LOGIN_PATH) {
    return <LoginPage />;
  }

  return (
    <AuthGuard>
      <AppShell>
        {path === "/products" ? <ProductsPage /> : null}
        {path === "/sales" ? <SalesPage /> : null}
        {path === "/stock" ? <StockPage /> : null}
        {path === "/cash" ? <CashPage /> : null}
        {path === "/dashboard" ? <DashboardPage /> : null}
      </AppShell>
    </AuthGuard>
  );
}

export function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <AppRoutes />
      </RouterProvider>
    </AuthProvider>
  );
}
