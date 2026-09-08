import { FileTextIcon } from "@clavia-ds/icons";
import { StepProgressIndicator } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

const meta = {
  args: {
    children: <FileTextIcon />,
    label: "Progresso da fase Formulários",
    value: 40,
  },
  argTypes: {
    children: { control: false },
    value: {
      control: { max: 100, min: 0, step: 1, type: "range" },
      description: "Valor anunciado de forma acessível; não altera o contorno visual.",
    },
  },
  component: StepProgressIndicator,
  parameters: {
    docs: {
      description: {
        component:
          "Marcador circular da fase atual do onboarding. O contorno permanece fechado em qualquer valor; o percentual continua explícito no texto do Stepper e no contrato acessível. Não use como loading nem como representação visual isolada do progresso.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Progresso/StepProgressIndicator",
} satisfies Meta<typeof StepProgressIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

function PhaseLabel({ value }: { value: number }) {
  return (
    <div className="clv-story-step-progress-row">
      <StepProgressIndicator label="Progresso da fase Formulários" value={value}>
        <FileTextIcon />
      </StepProgressIndicator>
      <span className="clv-story-step-progress-copy">
        <small>Fase</small>
        <strong>Formulários</strong>
      </span>
    </div>
  );
}

export const ReferenciaVisual: Story = {
  name: "Referência visual",
  render: ({ value }) => <PhaseLabel value={value} />,
  play: async ({ canvasElement }) => {
    const content = canvasElement.querySelector<HTMLElement>(
      ".clv-step-progress-indicator__content",
    );
    const outline = canvasElement.querySelector<SVGCircleElement>(
      ".clv-step-progress-indicator__outline",
    );

    await expect(content).not.toBeNull();
    await expect(outline).not.toBeNull();

    if (content && outline) {
      await expect(getComputedStyle(content).backgroundColor).toBe("rgb(34, 78, 130)");
      await expect(getComputedStyle(content).color).toBe("rgb(255, 255, 255)");
      await expect(getComputedStyle(content).inlineSize).toBe("32px");
      await expect(getComputedStyle(outline).stroke).toBe("rgb(86, 178, 237)");
      await expect(getComputedStyle(outline).strokeWidth).toBe("3px");
      await expect(outline).toHaveAttribute("r", "22");
    }
  },
};

export const Compacto: Story = {
  args: { size: "compact", value: 75 },
};

export const ContornoFechado: Story = {
  name: "Contorno fechado",
  args: { value: 100 },
};
