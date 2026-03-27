import { SystemPage } from "./SystemPage";

export function StockPage() {
  return (
    <SystemPage
      eyebrow="Estoque"
      title="Entradas, saidas e saldo"
      description="Estrutura inicial para movimentacao de estoque e auditoria das alteracoes feitas pelos usuarios."
      highlights={[
        "Registro de entrada e saida via POST /stock.",
        "Historico consolidado das movimentacoes da loja.",
        "Espaco pronto para filtros por produto, tipo e periodo.",
      ]}
    />
  );
}
