import { UserIcon, WrenchIcon } from "@clavia-ds/icons";
import { UserAccountPopover } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
  component: UserAccountPopover,
  parameters: {
    docs: {
      description: {
        component:
          "Use UserAccountPopover no cabeçalho quando a pessoa precisar reconhecer a sessão e acessar atalhos pessoais. Ele mostra nome, e-mail, ações da conta e saída em um grupo próprio. O gatilho padrão combina avatar e chevron. Para ações relacionadas ao registro exibido na tela, use DropdownMenu. Não o use como navegação principal ou para confirmar ações irreversíveis.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Navegação/UserAccountPopover",
} satisfies Meta<typeof UserAccountPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

const accountItems = [
  { icon: <UserIcon />, id: "profile", label: "Meu perfil" },
  { icon: <WrenchIcon />, id: "settings", label: "Configurações" },
];

export const Padrao: Story = {
  args: {
    avatarInitials: "MA",
    email: "marina.alves@exemplo.com",
    items: accountItems,
    name: "Marina Alves",
  },
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("button", { name: "Abrir menu de Marina Alves" });
    const chevron = trigger.querySelector(".clv-user-account-popover__default-trigger > svg");

    await expect(chevron).not.toBeNull();
    await expect(chevron).toHaveAttribute("data-icon-weight", "bold");
    await expect(getComputedStyle(chevron as SVGElement).inlineSize).toBe("20px");
    await userEvent.click(trigger);

    const body = within(canvasElement.ownerDocument.body);
    const menu = body.getByRole("menu", { name: "Abrir menu de Marina Alves" });
    await expect(menu).toHaveAttribute("aria-label", "Opções da conta de Marina Alves");
    await expect(menu).toBeVisible();
    await expect(body.getByText("marina.alves@exemplo.com")).toBeVisible();
    await expect(within(menu).getByRole("menuitem", { name: "Meu perfil" })).toBeVisible();
    await expect(body.getByRole("button", { name: "Sair" })).toBeVisible();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Aberto: Story = {
  args: {
    ...Padrao.args,
    defaultOpen: true,
    signOutLabel: "Encerrar sessão",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A saída permanece visualmente separada das ações de conta. Use um rótulo que descreva a consequência quando o produto exigir mais clareza.",
      },
    },
  },
};
