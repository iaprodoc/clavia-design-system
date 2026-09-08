import { Skeleton } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const meta = {
  args: {
    height: 96,
    label: "Carregando conteúdo",
    shape: "rectangle",
    width: 320,
  },
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component:
          "Reserva o espaço de uma área que ainda está carregando. Use formas próximas do conteúdo final para reduzir mudanças de layout; não use para operações sem estrutura previsível nem para comunicar progresso percentual. O movimento contínuo desaparece em reduced motion e pode ser pausado com `data-paused` quando a demonstração ou o contexto exigir.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Componentes/Feedback/Skeleton",
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status", { name: "Carregando conteúdo" })).toBeVisible();
  },
};

export const EstruturaDeCard: Story = {
  name: "Estrutura de card",
  render: () => (
    <div className="clv-story-skeleton-card">
      <Skeleton height={48} label="Carregando card" shape="circle" width={48} />
      <div className="clv-story-skeleton-lines">
        <Skeleton height={14} shape="text" width="65%" />
        <Skeleton height={12} shape="text" width="100%" />
        <Skeleton height={12} shape="text" width="82%" />
      </div>
    </div>
  ),
};

export const Movimentos: Story = {
  name: "Movimentos e sem movimento",
  render: () => (
    <div className="clv-story-stack">
      <Skeleton height={48} label="Carregando com shimmer" motion="shimmer" width={320} />
      <Skeleton height={48} label="Carregando com pulso" motion="pulse" width={320} />
      <Skeleton height={48} label="Carregando sem movimento" motion="none" width={320} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use shimmer quando a área representa uma reserva contínua de conteúdo; pulse pode ser usado em blocos mais compactos. Escolha `none` em contextos sem movimento ou quando o produto desativar animações.",
      },
    },
  },
};
