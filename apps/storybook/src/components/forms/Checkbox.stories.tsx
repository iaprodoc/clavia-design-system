import { Checkbox } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const meta = {
  args: {
    description: "Você poderá revisar esta escolha antes da ativação.",
    label: "Confirmo que os dados estão corretos",
  },
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          "Controle para uma escolha independente. O estado indeterminado representa uma seleção parcial e não substitui uma resposta explícita da pessoa usuária.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Formulários/Checkbox",
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

export const Selecionado: Story = {
  args: { defaultChecked: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");
    const style = getComputedStyle(checkbox);

    await expect(checkbox).toBeChecked();
    await expect(style.borderColor).toBe(style.backgroundColor);
    await expect(style.boxShadow).toBe("none");
  },
};

export const Indeterminado: Story = {
  args: { indeterminate: true },
};

export const Desabilitado: Story = {
  args: { disabled: true },
};

export const Erro: Story = {
  args: {
    error: "Aceite os termos para continuar.",
    label: "Aceito os termos de atendimento",
  },
};
