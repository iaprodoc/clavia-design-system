import { Toggle } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";

const meta = {
  args: {
    children: "Destaque",
  },
  component: Toggle,
  parameters: {
    docs: {
      description: {
        component:
          "Botão que representa um estado pressionado e reversível, como destacar ou fixar uma ação. Use Switch para configuração binária persistente, Checkbox para escolhas independentes e RadioGroup para uma escolha exclusiva.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Formulários/Toggle",
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Desligado: Story = {
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole("button", { name: "Destaque" });

    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
  },
};

export const Ligado: Story = {
  args: { defaultPressed: true, variant: "outline" },
};

export const Desabilitado: Story = {
  args: { disabled: true, variant: "outline" },
};
