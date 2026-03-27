import { SystemPage } from "./SystemPage";

export function CashPage() {
  return (
    <SystemPage
      eyebrow="Caixa"
      title="Operacao de caixa"
      description="Base para abertura, fechamento, sangria, suprimento e consulta do caixa atual."
      highlights={[
        "Consulta do caixa em aberto e historico de fechamentos.",
        "Fluxos de abertura, deposito e retirada usando as rotas /cash.",
        "Preparado para controles por perfil, especialmente no fechamento.",
      ]}
    />
  );
}
