import { LinkButton } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

const meta = {
  args: {
    children: "Ver orientações",
    href: "#orientacoes",
    variant: "primary",
  },
  component: LinkButton,
  parameters: {
    docs: {
      description: {
        component:
          "Link com presença visual de ação. Em repouso, não usa sublinhado; a linha aparece apenas no hover. Use para navegação real; quando a interação altera o estado da página sem mudar de destino, use Button.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Ações/LinkButton",
} satisfies Meta<typeof LinkButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Ver orientações" });
    await expect(link).toHaveAttribute("href", "#orientacoes");
    await expect(getComputedStyle(link).textDecorationLine).toBe("none");
  },
};

export const Secundario: Story = {
  name: "Secundário",
  args: {
    children: "Voltar ao processo",
    variant: "secondary",
  },
};
