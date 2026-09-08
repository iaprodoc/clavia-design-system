import { Input } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

const meta = {
  args: {
    "aria-label": "Nome da clínica",
    placeholder: "Digite o nome da clínica",
  },
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          "Controle textual de uma linha. Em formulários do produto, componha com Field para fornecer rótulo visível, ajuda e erro; aria-label nesta página existe apenas para demonstrar o controle isolado.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Formulários/Input",
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvas }) => {
    await expect(
      getComputedStyle(canvas.getByRole("textbox", { name: "Nome da clínica" })).fontSize,
    ).toBe("14px");
  },
};

export const Preenchido: Story = {
  args: { defaultValue: "Clínica Aurora" },
};

export const Desabilitado: Story = {
  args: { defaultValue: "Clínica Aurora", disabled: true },
};
