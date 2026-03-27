import { SystemPage } from "./SystemPage";

export function SalesPage() {
  return (
    <SystemPage
      eyebrow="Vendas"
      title="Fluxo comercial e historico"
      description="Ponto de partida para o PDV e para acompanhamento das vendas registradas pela loja."
      highlights={[
        "Criacao de vendas com itens e pagamentos.",
        "Consulta de historico e visualizacao de detalhes por venda.",
        "Relatorios do dia, por periodo e por forma de pagamento.",
      ]}
    />
  );
}
