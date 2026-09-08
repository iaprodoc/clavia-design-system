import { Popover } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
  component: Popover,
  parameters: {
    docs: {
      description: {
        component:
          "Use Popover para informação breve, contextual e não bloqueante. Feche-o por Escape ou clique fora; para conteúdo longo ou uma tarefa que exige foco, use Sheet ou Dialog.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Feedback/Popover",
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  args: {
    children: "Use para conteúdo curto, contextual e não bloqueante.",
    title: "Detalhes",
    trigger: "Ver detalhes",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Ver detalhes" });
    await userEvent.click(trigger);

    const body = within(canvasElement.ownerDocument.body);
    const content = body.getByRole("dialog", { name: "Detalhes" });
    const popover = content.closest(".clv-popover");
    await expect(popover).not.toBeNull();
    const style = getComputedStyle(popover as Element);

    await expect(style.padding).toBe("12px");
    await expect(style.borderRadius).toBe("16px");
    await expect(style.borderWidth).toBe("1px");
    await expect(style.fontFamily).toContain("Sora Variable");

    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(body.queryByRole("dialog", { name: "Detalhes" })).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const ControladoAberto: Story = {
  args: {
    children: "O estado aberto é coordenado pelo produto nesta demonstração.",
    isOpen: true,
    onOpenChange: () => undefined,
    title: "Detalhes controlados",
    trigger: "Ver detalhes controlados",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `isOpen` com `onOpenChange` para coordenar o estado externo. Não combine esse contrato com `defaultOpen`.",
      },
    },
  },
};
