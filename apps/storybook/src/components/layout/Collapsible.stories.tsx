import { Collapsible } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";

const meta = {
  args: {
    children:
      "Este conteúdo reúne opções secundárias sem interromper a leitura da configuração principal.",
    title: "Opções avançadas",
  },
  component: Collapsible,
  parameters: {
    docs: {
      description: {
        component:
          "Use Collapsible para revelar conteúdo secundário no contexto imediato. Para uma coleção de seções, componha instâncias independentes; para navegação ou menus, use os padrões de navegação e sobreposição já publicados.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Layout/Collapsible",
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Fechado: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Opções avançadas" });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByRole("region", { name: "Opções avançadas" })).toBeVisible();
  },
};

export const Aberto: Story = {
  args: { defaultOpen: true, title: "Regras de encaminhamento" },
};

export const Desabilitado: Story = {
  args: { disabled: true, title: "Detalhes indisponíveis" },
};
