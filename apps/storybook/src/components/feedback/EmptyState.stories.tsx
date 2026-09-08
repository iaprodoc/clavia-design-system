import { Button, EmptyState } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const meta = {
  args: {
    description: "Adicione uma regra para começar.",
    title: "Nenhuma regra adicional",
  },
  component: EmptyState,
  parameters: {
    docs: {
      description: {
        component:
          "Explica por que uma área ainda não tem conteúdo e, quando houver próximo passo, apresenta uma ação explícita. A ilustração padrão usa o asset aprovado do Design System e pode ser substituída pelo slot illustration. Não use como substituto genérico para falhas de carregamento.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Feedback/EmptyState",
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole("heading", { name: "Nenhuma regra adicional" });
    const illustration = canvasElement.querySelector<HTMLElement>(".clv-empty-state__illustration");

    await expect(illustration).not.toBeNull();
    await expect(illustration?.compareDocumentPosition(title)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    await expect(
      canvasElement.querySelector('[data-empty-state-asset="img_empty_state2.webp"]'),
    ).not.toBeNull();
  },
};

export const ComAcao: Story = {
  name: "Com ação",
  args: {
    action: <Button variant="secondary">Adicionar primeira regra</Button>,
  },
};
