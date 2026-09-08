import type { NotificationPopoverItem } from "@clavia-ds/ui";

export const hubNotificationItems = [
  {
    description: "A Clínica Aurora parou de receber eventos. Revise a conexão.",
    id: "integration-paused",
    isUnread: true,
    time: "Há 18 min",
    title: "Integração interrompida",
    tone: "warning",
  },
  {
    description: "O resumo de desempenho está pronto para consulta.",
    id: "weekly-report",
    isUnread: true,
    time: "Há 1 h",
    title: "Relatório semanal concluído",
    tone: "success",
  },
  {
    description: "Marina Alves agora pode consultar relatórios.",
    id: "access-approved",
    time: "Ontem",
    title: "Novo acesso aprovado",
    tone: "info",
  },
] satisfies NotificationPopoverItem[];
