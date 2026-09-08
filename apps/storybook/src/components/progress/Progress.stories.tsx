import { Progress } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

const meta = {
  args: {
    label: "Processo comercial",
    value: 40,
  },
  component: Progress,
  parameters: {
    docs: {
      description: {
        component:
          "Progresso contínuo de uma tarefa com começo e fim conhecidos. O rótulo e o valor permanecem disponíveis semanticamente; não use para representar status qualitativo.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Progresso/Progress",
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EmAndamento: Story = { name: "Em andamento" };

export const Concluido: Story = {
  name: "Concluído",
  args: { value: 100 },
};

export const Circular: Story = {
  args: {
    label: "Configuração do projeto",
    value: 75,
    variant: "circular",
  },
  play: async ({ canvasElement }) => {
    const progress = canvasElement.querySelector<HTMLElement>(".clv-progress--circular");

    await expect(progress).not.toBeNull();

    if (progress) {
      const indicator = progress.querySelector(".clv-progress__circular-indicator");

      await expect(indicator).toHaveAttribute("stroke-linecap", "round");
      await expect(getComputedStyle(indicator as SVGCircleElement).stroke).toBe(
        "rgb(86, 178, 237)",
      );
    }
  },
};

export const ComparativoCircular: Story = {
  name: "Comparativo circular",
  render: () => (
    <div className="clv-story-progress-circular-group">
      <Progress label="Progresso de 18%" value={18} variant="circular" />
      <Progress label="Progresso de 58%" value={58} variant="circular" />
      <Progress label="Progresso concluído" value={100} variant="circular" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll(".clv-progress--circular")).toHaveLength(3);
  },
};
