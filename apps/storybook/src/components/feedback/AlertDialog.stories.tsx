import { TrashIcon } from "@clavia-ds/icons";
import { AlertDialog, Button } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
  component: AlertDialog,
  parameters: {
    docs: {
      description: {
        component:
          'Use para confirmar uma consequência crítica. O padrão combina ícone semântico no topo, título e contexto no conteúdo, divisor e ações no rodapé. O tom padrão é `warning`; use `danger` quando a confirmação remove, descarta ou desativa algo e aplique `Button variant="danger"` à ação confirmatória. Formulários e tarefas contínuas permanecem em Dialog.',
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Feedback/AlertDialog",
} satisfies Meta<typeof AlertDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

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
    closeButtonLabel: "Cancelar exclusão",
    children: "Os dados e as permissões associadas serão removidos desta configuração.",
    description: "Esta ação não pode ser desfeita.",
    headerIcon: <TrashIcon />,
    title: "Excluir projeto?",
    tone: "danger",
    trigger: "Excluir projeto",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Excluir projeto" }));

    const body = within(canvasElement.ownerDocument.body);
    const alert = body.getByRole("alertdialog", { name: "Excluir projeto?" });
    const close = body.getByRole("button", { name: "Cancelar exclusão" });
    const actions = alert.querySelector(".clv-dialog__actions");

    const icon = alert.querySelector(".clv-dialog__header-icon svg");

    await expect(icon).toBeInTheDocument();
    await expect(getComputedStyle(icon as Element).width).toBe("20px");
    await expect(close).toBeVisible();
    await expect(actions).not.toBeNull();
    await expect(getComputedStyle(actions as Element).borderBlockStartWidth).toBe("1px");

    await userEvent.click(close);
    await waitFor(() => expect(body.queryByRole("alertdialog")).not.toBeInTheDocument());
  },
};

export const ConfirmacaoDeAviso: Story = {
  name: "Confirmação de aviso",
  args: {
    actions: (
      <>
        <Button slot="close" variant="secondary">
          Continuar revisando
        </Button>
        <Button slot="close">Confirmar publicação</Button>
      </>
    ),
    description: "Revise o conteúdo antes de disponibilizá-lo para a equipe.",
    title: "Publicar esta versão?",
    tone: "warning",
    trigger: "Confirmar publicação",
  },
};
