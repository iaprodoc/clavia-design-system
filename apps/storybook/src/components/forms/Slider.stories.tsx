import { Slider } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";

const formatMonths = (value: number) => `${value} ${value === 1 ? "mês" : "meses"}`;

const meta = {
  args: {
    defaultValue: 2,
    description: "A agenda poderá receber novos agendamentos dentro desse período.",
    formatValue: formatMonths,
    label: "Agenda liberada",
    maxValue: 6,
    minValue: 1,
  },
  component: Slider,
  parameters: {
    docs: {
      description: {
        component:
          "Valor numérico dentro de um intervalo conhecido, com o valor atual sempre visível. Não use quando cada opção tiver consequências distintas que precisem ser lidas antes da escolha.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Formulários/Slider",
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

export const Intervalo: Story = {
  args: {
    defaultValue: [2, 5],
    thumbLabels: ["Início da janela", "Fim da janela"],
  },
};

export const Vertical: Story = {
  args: { defaultValue: 4, orientation: "vertical" },
  name: "Vertical",
};

export const Erro: Story = {
  args: { error: "Escolha uma janela entre 1 e 6 meses." },
};

export const Desabilitado: Story = {
  args: { disabled: true },
};

export const Obrigatorio: Story = {
  args: { required: true },
  name: "Obrigatório",
};

export const InteracoesCriticas: Story = {
  name: "Interações críticas",
  play: async ({ canvas, canvasElement }) => {
    const slider = canvas.getByRole("slider", { name: "Agenda liberada" });
    const fill = canvasElement.querySelector<HTMLElement>(".clv-slider__fill");
    const thumb = canvasElement.querySelector<HTMLElement>(".clv-slider__thumb");

    if (!fill || !thumb) {
      throw new Error("Preenchimento ou thumb do Slider não encontrado.");
    }

    await expect(getComputedStyle(fill).height).toBe("6px");
    await expect(getComputedStyle(thumb).height).toBe("18px");
    await expect(getComputedStyle(thumb).width).toBe("18px");

    await userEvent.click(slider);
    await userEvent.keyboard("{ArrowRight}");
    await expect(slider).toHaveValue("3");
  },
};
