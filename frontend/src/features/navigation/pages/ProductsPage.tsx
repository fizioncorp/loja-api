import { SystemPage } from "./SystemPage";

export function ProductsPage() {
  return (
    <SystemPage
      eyebrow="Produtos"
      title="Base de catalogo e manutencao"
      description="Pagina inicial para o modulo de produtos. Ela ja esta protegida e pronta para receber listagem, busca, criacao e edicao."
      highlights={[
        "Listagem paginada usando GET /products.",
        "Busca por nome e leitura por codigo de barras.",
        "Acoes futuras de ativar, desativar, editar e consultar historico de estoque.",
      ]}
    />
  );
}
