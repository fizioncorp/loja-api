export const LOGIN_PATH = "/login";
export const DEFAULT_AUTH_PATH = "/dashboard";
export const REDIRECT_STORAGE_KEY = "auth:redirect";

export const protectedPaths = [
  "/dashboard",
  "/products",
  "/sales",
  "/stock",
  "/cash",
] as const;

export type ProtectedPath = (typeof protectedPaths)[number];

export type AppPath = typeof LOGIN_PATH | ProtectedPath;

export interface NavigationItem {
  label: string;
  path: ProtectedPath;
  description: string;
}

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    description: "Visao geral da operacao",
  },
  {
    label: "Produtos",
    path: "/products",
    description: "Cadastro e consulta de catalogo",
  },
  {
    label: "Vendas",
    path: "/sales",
    description: "Fluxo comercial e historico",
  },
  {
    label: "Estoque",
    path: "/stock",
    description: "Entradas, saidas e saldo",
  },
  {
    label: "Caixa",
    path: "/cash",
    description: "Abertura, fechamento e movimentos",
  },
];

export function isProtectedPath(path: string): path is ProtectedPath {
  return protectedPaths.includes(path as ProtectedPath);
}

export function normalizePath(path: string): AppPath {
  if (path === "/" || path === "") {
    return DEFAULT_AUTH_PATH;
  }

  if (path === LOGIN_PATH) {
    return LOGIN_PATH;
  }

  if (isProtectedPath(path)) {
    return path;
  }

  return DEFAULT_AUTH_PATH;
}
