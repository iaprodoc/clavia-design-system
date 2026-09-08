import { TrendingUpIcon } from "@clavia-ds/icons";
import { MetricCard, StatusBadge } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const meta = {
  component: MetricCard,
  parameters: {
    docs: {
      description: {
        component:
          'Use para leitura de um indicador. A tendência deve explicar o resultado em texto; quando tiver ícone, a regra do componente centraliza os dois e usa o menor espaçamento da escala. A cor apenas reforça o estado. Use `tag` somente para um resumo curto, como `+12%` ou `1 alerta`, exibido ao lado do rótulo. Quando houver `description`, o componente a apresenta no tooltip de ajuda compacto no canto superior direito; reserve-a para esclarecimentos curtos e não essenciais. Use `valueFormat="two-digit"` apenas para contagens inteiras em que a leitura sequencial, como `01` e `02`, seja útil. Não use como atalho ou destino de navegação.',
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Dados/MetricCard",
} satisfies Meta<typeof MetricCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Neutro: Story = {
  args: {
    description: "Acompanhe o volume disponível para a próxima etapa da operação.",
    label: "Leads qualificados",
    trend: "Volume estável em relação à semana anterior",
    tone: "neutral",
    value: "18",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole("region", { name: "Leads qualificados" });
    const help = canvas.getByRole("button", { name: "Mais informações sobre Leads qualificados" });

    await expect(card).toHaveClass("clv-metric-card--neutral");
    await expect(canvas.getByText(/Volume estável/)).toBeVisible();
    await expect(help).toBeVisible();
    await expect(getComputedStyle(help.querySelector("svg") as SVGElement).inlineSize).toBe("14px");
    await expect(card.querySelector(".clv-metric-card__description")).toBeNull();
  },
};

export const Sucesso: Story = {
  args: {
    label: "Projetos ativos",
    trend: "Crescimento de 12% em relação ao mês anterior",
    tone: "success",
    value: "24",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("region", { name: "Projetos ativos" })).toBeVisible();
    await expect(canvas.getByText(/Crescimento de 12%/)).toBeVisible();
  },
};

export const Atencao: Story = {
  args: {
    label: "Pendências de cadastro",
    trend: "Atenção: 3 cadastros aguardam revisão",
    tone: "warning",
    value: "3",
  },
};

export const Risco: Story = {
  args: {
    label: "Integrações interrompidas",
    trend: "Risco: 2 integrações precisam de reconexão",
    tone: "danger",
    value: "2",
  },
};

export const DoisDigitos: Story = {
  name: "Contagem com dois dígitos",
  args: {
    label: "Convites pendentes",
    trend: "Aguardando aceitação",
    tone: "warning",
    value: 2,
    valueFormat: "two-digit",
  },
};

export const ComTagCurta: Story = {
  name: "Com tag curta",
  args: {
    label: "Conversão em agendamento",
    tag: (
      <StatusBadge size="xs" status="success" variant="soft">
        +4,2 p.p.
      </StatusBadge>
    ),
    tone: "success",
    trend: (
      <span>
        <TrendingUpIcon /> Acima da semana anterior
      </span>
    ),
    value: "42,1%",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas
      .getByRole("region", { name: "Conversão em agendamento" })
      .querySelector(".clv-metric-card__heading");

    await expect(heading).not.toBeNull();
    await expect(getComputedStyle(heading as HTMLElement).alignItems).toBe("center");
  },
};
