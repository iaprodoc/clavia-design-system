import { ArchiveIcon, CopyIcon, DotsThreeIcon, PencilIcon, TrashIcon } from "@clavia-ds/icons";
import { DropdownMenu } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
  component: DropdownMenu,
  parameters: {
    docs: {
      description: {
        component:
          "Use DropdownMenu para ações secundárias relacionadas a um único contexto. A propriedade `icon` acompanha cada ação com um ícone representativo. Use `hasSeparatorBefore` para iniciar um grupo neutro em uma faixa de largura total e `isDestructive` somente quando a ação for irreversível. Itens indisponíveis continuam nomeados, mas não podem receber ação. Não use o menu como navegação persistente.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Feedback/DropdownMenu",
} satisfies Meta<typeof DropdownMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Acoes: Story = {
  args: {
    items: [
      { icon: <PencilIcon />, id: "edit", label: "Editar" },
      { icon: <CopyIcon />, id: "duplicate", label: "Duplicar" },
      { icon: <TrashIcon />, id: "delete", isDestructive: true, label: "Excluir arquivo" },
    ],
    label: "Ações do projeto",
    trigger: "Ações do projeto",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Ações do projeto" });
    await userEvent.click(trigger);

    const body = within(canvasElement.ownerDocument.body);
    const menu = body.getByRole("menu", { name: "Ações do projeto" });
    const surface = menu.closest(".clv-dropdown-menu");
    const destructive = body.getByRole("menuitem", { name: "Excluir arquivo" });

    await expect(surface).not.toBeNull();
    await expect(getComputedStyle(surface as Element).padding).toBe("4px");
    await expect(getComputedStyle(surface as Element).borderRadius).toBe("16px");
    await expect(getComputedStyle(destructive).fontSize).toBe("14px");
    await expect(getComputedStyle(destructive).borderRadius).toBe("0px");
    await expect(destructive).toHaveAttribute("data-destructive", "true");
    await expect(destructive).toHaveClass("clv-dropdown-menu__item--first-destructive");

    const surfaceBounds = (surface as Element).getBoundingClientRect();
    const destructiveBounds = destructive.getBoundingClientRect();
    const surfaceBorder = Number.parseFloat(
      getComputedStyle(surface as Element).borderInlineStartWidth,
    );
    await expect(Math.round(destructiveBounds.left)).toBe(
      Math.round(surfaceBounds.left + surfaceBorder),
    );
    await expect(Math.round(destructiveBounds.right)).toBe(
      Math.round(surfaceBounds.right - surfaceBorder),
    );
    await expect(Math.round(destructiveBounds.bottom)).toBe(
      Math.round(surfaceBounds.bottom - surfaceBorder),
    );

    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(body.queryByRole("menu", { name: "Ações do projeto" })).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const ControladoAberto: Story = {
  args: {
    isOpen: true,
    items: [{ icon: <PencilIcon />, id: "edit", label: "Editar" }],
    label: "Ações controladas",
    onOpenChange: () => undefined,
    trigger: "Ações controladas",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `isOpen` com `onOpenChange` quando o menu depender de um estado externo. Não combine esse contrato com `defaultOpen`.",
      },
    },
  },
};

export const Overflow: Story = {
  name: "Overflow com três pontos",
  args: {
    items: [
      { icon: <PencilIcon />, id: "edit", label: "Editar" },
      { icon: <ArchiveIcon />, id: "archive", label: "Arquivar" },
    ],
    label: "Mais ações do projeto",
    trigger: <DotsThreeIcon aria-hidden="true" />,
    triggerLabel: "Mais ações do projeto",
    triggerVariant: "overflow",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use o trigger de três pontos quando o contexto tiver várias ações secundárias e a composição já tiver uma ação principal visível. O anel de foco aparece apenas na navegação por teclado; ao fechar por clique ou toque, o trigger não mantém uma borda residual.",
      },
    },
  },
  play: async ({ canvas, canvasElement }) => {
    const canvasTrigger = canvas.getByRole("button", { name: "Mais ações do projeto" });
    await userEvent.click(canvasTrigger);
    const menu = within(canvasElement.ownerDocument.body).getByRole("menu", {
      name: "Mais ações do projeto",
    });
    await waitFor(() =>
      expect(within(menu).getByRole("menuitem", { name: "Editar" })).toBeVisible(),
    );
    await userEvent.click(canvasElement);
    await waitFor(() => expect(canvasTrigger).toHaveFocus());
    await expect(canvasTrigger).not.toHaveAttribute("data-focus-visible", "true");
    await expect(getComputedStyle(canvasTrigger).outlineStyle).toBe("none");
  },
};

export const FocoPorTeclado: Story = {
  name: "Foco por teclado",
  args: Overflow.args,
  parameters: {
    docs: {
      description: {
        story:
          "O foco do trigger é visível ao navegar com Tab e continua após fechar o menu com Escape. Esse comportamento não se aplica ao fechamento por clique ou toque.",
      },
    },
  },
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("button", { name: "Mais ações do projeto" });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveAttribute("data-focus-visible", "true");
    await expect(getComputedStyle(trigger).outlineStyle).toBe("solid");

    await userEvent.keyboard("{Enter}");
    const menu = within(canvasElement.ownerDocument.body).getByRole("menu", {
      name: "Mais ações do projeto",
    });
    await expect(menu).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(trigger).toHaveAttribute("data-focus-visible", "true");
  },
};
