import { Button, Dialog } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component:
          'Use Dialog para uma decisão ou tarefa curta que interrompe o fluxo. A anatomia padrão traz ícone de contexto, botão de fechar e rodapé separado por divisor para as ações. Para uma confirmação irreversível, use `variant="alert"`; ela exige uma ação explícita e não fecha por Escape nem por clique fora.',
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Feedback/Dialog",
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  args: {
    actions: (
      <Button slot="close" variant="secondary">
        Cancelar
      </Button>
    ),
    children: "O conteúdo pode orientar uma tarefa curta, sem assumir regras de domínio.",
    title: "Editar configuração",
    trigger: "Editar configuração",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Editar configuração" });
    await userEvent.click(trigger);

    const body = within(canvasElement.ownerDocument.body);
    const dialog = body.getByRole("dialog", { name: "Editar configuração" });
    const overlay = dialog.closest(".clv-dialog__overlay");
    const style = getComputedStyle(dialog);
    const compact =
      canvasElement.ownerDocument.defaultView?.matchMedia("(max-width: 40rem)").matches;

    await expect(style.padding).toBe("0px");
    await expect(style.gap).toBe("0px");
    await expect(style.borderRadius).toBe(compact ? "16px 16px 0px 0px" : "16px");
    await expect(style.fontFamily).toContain("Sora Variable");
    await expect(overlay).not.toBeNull();
    await expect(getComputedStyle(overlay as Element).padding).toBe(compact ? "0px" : "16px");
    await expect(getComputedStyle(overlay as Element).zIndex).toBe("50");
    await expect(within(dialog).getByRole("button", { name: "Fechar" })).toBeVisible();
    await expect(dialog.querySelector(".clv-dialog__header-icon")).toBeInTheDocument();
    await expect(dialog.querySelector(".clv-dialog__actions")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(body.queryByRole("dialog", { name: "Editar configuração" })).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const ConfirmacaoCritica: Story = {
  args: {
    actions: (
      <>
        <Button slot="close" variant="secondary">
          Cancelar
        </Button>
        <Button slot="close" variant="danger">
          Excluir permanentemente
        </Button>
      </>
    ),
    description: "Esta ação não pode ser desfeita.",
    title: "Excluir projeto?",
    tone: "danger",
    trigger: "Excluir projeto",
    variant: "alert",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Excluir projeto" }));
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(body.getByRole("alertdialog", { name: "Excluir projeto?" })).toBeVisible(),
    );
    await expect(body.getByRole("button", { name: "Excluir permanentemente" })).toHaveClass(
      "clv-button--danger",
    );
  },
};

export const DecisaoComContexto: Story = {
  name: "Decisão com contexto",
  args: {
    actions: (
      <>
        <Button slot="close" variant="secondary">
          Voltar
        </Button>
        <Button slot="close">Confirmar publicação</Button>
      </>
    ),
    description: "A versão revisada será disponibilizada para a equipe.",
    title: "Publicar esta versão?",
    tone: "info",
    trigger: "Revisar publicação",
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `tone` quando uma decisão curta precisar de contexto semântico. Para exclusão, descarte ou desativação, use `tone="danger"` e `Button variant="danger"` na ação confirmatória.',
      },
    },
  },
};

export const ControladoAberto: Story = {
  args: {
    isOpen: true,
    onOpenChange: () => undefined,
    title: "Configuração controlada",
    trigger: "Editar configuração controlada",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `isOpen` com `onOpenChange` quando o produto precisar coordenar a abertura. Não misture esse contrato com `defaultOpen`.",
      },
    },
  },
};

export const FechamentoExplicitamenteControlado: Story = {
  name: "Fechamento explicitamente controlado",
  args: {
    description: "A superfície permanece aberta até uma ação ou evento autorizado.",
    isDismissable: false,
    isKeyboardDismissDisabled: true,
    isOpen: true,
    onOpenChange: () => undefined,
    title: "Revisar antes de continuar",
    trigger: "Abrir revisão",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use as propriedades de fechamento apenas quando o fluxo exigir uma política diferente da variante padrão. O foco continua preso ao overlay e a ação de saída deve existir dentro do conteúdo.",
      },
    },
  },
};
