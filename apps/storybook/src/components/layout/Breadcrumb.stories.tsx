import { Breadcrumb } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

const meta = {
  component: Breadcrumb,
  args: {
    items: [
      { href: "#projetos", id: "projetos", label: "Projetos" },
      { href: "#aurora", id: "aurora", label: "Clínica Aurora" },
      { id: "configuracao", label: "Configuração" },
    ],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Mostra a localização em uma hierarquia curta de conteúdo. Use apenas quando cada nível permitir voltar a um destino real; para avançar ou trocar de fase, use Stepper ou Tabs.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Layout/Breadcrumb",
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "Projetos" })).toHaveAttribute(
      "href",
      "#projetos",
    );
    await expect(canvas.getByText("Configuração")).toHaveAttribute("aria-current", "page");
  },
};
