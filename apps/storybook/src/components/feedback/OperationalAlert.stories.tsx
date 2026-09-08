import { Button, OperationalAlert } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta = {
  component: OperationalAlert,
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "100%", maxInlineSize: "38rem" }}>
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`inline` é a anatomia padrão para ocorrências curtas dentro de um fluxo, com impacto no bloco de conteúdo e ação lateral. Use `featured` quando a ocorrência precisar de maior destaque, separando impacto e próxima ação no rodapé. Mensagens locais mais simples usam InlineBanner; confirmações críticas usam AlertDialog.",
      },
    },
  },
  title: "Componentes/Feedback/OperationalAlert",
} satisfies Meta<typeof OperationalAlert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ConexoesInterrompidas: Story = {
  args: {
    actions: <Button size="xs">Ver integrações</Button>,
    children: "A autenticação precisa ser refeita.",
    impact: "3 integrações afetadas",
    severity: "danger",
    title: "Conexões interrompidas",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByRole("alert", { name: "Conexões interrompidas" });
    const action = canvas.getByRole("button", { name: "Ver integrações" });

    await expect(alert).toHaveClass("clv-alert--inline", "clv-operational-alert");
    await expect(alert.querySelector(".clv-alert__message")).toHaveTextContent(
      "3 integrações afetadas",
    );
    await userEvent.tab();
    await expect(action).toHaveFocus();
  },
};

export const Destacado: Story = {
  args: {
    actions: (
      <Button size="sm" variant="outline">
        Ver integrações
      </Button>
    ),
    children: "A autenticação precisa ser refeita.",
    impact: "3 integrações afetadas",
    severity: "danger",
    title: "Conexões interrompidas",
    variant: "featured",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByRole("alert", { name: "Conexões interrompidas" });

    await expect(alert).toHaveClass("clv-alert--featured", "clv-operational-alert");
    await expect(alert.querySelector(".clv-alert__metadata")).toHaveTextContent(
      "3 integrações afetadas",
    );
    await expect(canvas.getByRole("button", { name: "Ver integrações" })).toBeVisible();
  },
};

export const EstadosSemanticos: Story = {
  args: {
    actions: null,
    title: "Estados semânticos",
  },
  name: "Estados semânticos",
  render: () => (
    <div className="clv-story-stack">
      <OperationalAlert
        actions={<Button size="xs">Ver processamento</Button>}
        impact="12 itens na fila"
        severity="info"
        title="Processamento em andamento"
      >
        A atualização continua em segundo plano.
      </OperationalAlert>
      <OperationalAlert
        actions={<Button size="xs">Revisar fila</Button>}
        impact="4 itens aguardando revisão"
        severity="warning"
        title="Atenção necessária"
      >
        Algumas entradas precisam de validação manual.
      </OperationalAlert>
      <OperationalAlert
        actions={<Button size="xs">Corrigir conexões</Button>}
        impact="3 integrações afetadas"
        severity="danger"
        title="Conexões interrompidas"
      >
        A autenticação precisa ser refeita.
      </OperationalAlert>
    </div>
  ),
};
