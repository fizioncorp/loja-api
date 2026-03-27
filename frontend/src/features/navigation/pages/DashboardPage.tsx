import { SystemPage } from "./SystemPage";

export function DashboardPage() {
  return (
    <SystemPage
      eyebrow="Dashboard"
      title="Painel principal da operacao"
      description="Esse espaco vira o ponto de entrada apos o login. Ele ja serve como destino padrao para o redirecionamento e concentra os atalhos do sistema."
      highlights={[
        "Resumo rapido de vendas do dia, caixa atual e alertas do estoque.",
        "Atalhos para iniciar venda, cadastrar produto e abrir ou fechar caixa.",
        "Area ideal para incluir indicadores do backend conforme formos conectando os modulos.",
      ]}
      footer="O login agora sempre aterrissa aqui, exceto quando o usuario tentou abrir outra rota protegida antes de autenticar."
    />
  );
}
