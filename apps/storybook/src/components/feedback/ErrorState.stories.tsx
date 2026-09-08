import { Button, ErrorState } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

const meta = {
  args: {
    action: <Button>Tentar novamente</Button>,
    description: "Verifique sua conexão e tente outra vez.",
    title: "Não foi possível carregar suas respostas",
  },
  component: ErrorState,
  parameters: {
    docs: {
      description: {
        component:
          "Explica uma falha que impede a área de continuar e oferece uma recuperação clara. Use EmptyState quando não houver conteúdo por uma condição normal; use Alert quando a falha puder permanecer junto do restante da interface.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Componentes/Feedback/ErrorState",
} satisfies Meta<typeof ErrorState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ComRecuperacao: Story = {
  args: {
    action: undefined,
  },
  name: "Com recuperação",
  render: (args) => {
    const onRetry = fn();
    return <ErrorState {...args} action={<Button onClick={onRetry}>Tentar novamente</Button>} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByRole("alert", {
      name: "Não foi possível carregar suas respostas",
    });

    await expect(alert).toHaveAccessibleDescription("Verifique sua conexão e tente outra vez.");
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Tentar novamente" })).toHaveFocus();
  },
};

export const SemAcaoDisponivel: Story = {
  args: {
    action: undefined,
    description: "Volte mais tarde. Se o problema continuar, fale com o suporte.",
    title: "Serviço temporariamente indisponível",
  },
  name: "Sem ação disponível",
  play: async ({ canvasElement }) => {
    const description = within(canvasElement).getByText(
      "Volte mais tarde. Se o problema continuar, fale com o suporte.",
    );

    await expect(getComputedStyle(description).textWrap).toBe("balance");
  },
};
