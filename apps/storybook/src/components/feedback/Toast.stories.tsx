import { Button, Toast } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

const meta = {
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Use para uma confirmação transitória fora do conteúdo afetado. O produto controla fila, duração, posição e montagem da região. A ação opcional precisa descrever uma próxima etapa; avisos persistentes perto do conteúdo usam Alert ou InlineBanner.",
      },
    },
  },
  title: "Componentes/Feedback/Toast",
} satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ProjetoSalvo: Story = {
  args: {
    title: "Projeto salvo",
  },
  render: () => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Toast
        description="As alterações já estão disponíveis para a equipe."
        onDismiss={() => setVisible(false)}
        title="Projeto salvo"
      />
    ) : (
      <p role="status">Notificação fechada.</p>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status", { name: "Projeto salvo" })).toBeVisible();
    const dismiss = canvas.getByRole("button", { name: "Fechar notificação" });
    await userEvent.tab();
    await expect(dismiss).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByText("Notificação fechada.")).toBeVisible();
  },
};

export const Atencao: Story = {
  args: {
    description: "Algumas mensagens ainda aguardam o restabelecimento da conexão.",
    status: "warning",
    title: "Conexão instável",
  },
};

export const FalhaAoSalvar: Story = {
  args: {
    description: "Revise a conexão e tente salvar novamente.",
    status: "danger",
    title: "Não foi possível salvar o projeto",
  },
};

export const Informacao: Story = {
  args: {
    description: "A nova regra será aplicada nas próximas execuções.",
    status: "info",
    title: "Atualização programada",
  },
};

export const AcaoOpcional: Story = {
  args: {
    title: "Falha ao salvar",
  },
  render: () => {
    const [requested, setRequested] = useState(false);
    return (
      <Toast
        action={
          <Button onClick={() => setRequested(true)} size="sm" variant="secondary">
            Tentar novamente
          </Button>
        }
        description={
          requested ? "Uma nova tentativa foi iniciada." : "Revise a conexão e tente de novo."
        }
        onDismiss={() => undefined}
        status="danger"
        title="Falha ao salvar"
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const retry = canvas.getByRole("button", { name: "Tentar novamente" });
    retry.focus();
    await expect(retry).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByText("Uma nova tentativa foi iniciada.")).toBeVisible();
  },
};
