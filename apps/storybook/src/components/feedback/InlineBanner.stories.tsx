import { Button, InlineBanner } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

const onReview = fn();

const meta = {
  args: {
    children: "As informações são atualizadas automaticamente.",
    title: "Sincronização ativa",
  },
  component: InlineBanner,
  decorators: [
    (Story) => (
      <div style={{ maxInlineSize: "38rem" }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Aviso persistente e compacto dentro de uma seção ou fluxo. Use para contexto acionável próximo ao conteúdo; prefira Alert para mensagens mais extensas e Toast para confirmações transitórias.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Feedback/InlineBanner",
} satisfies Meta<typeof InlineBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvasElement }) => {
    const banner = within(canvasElement).getByRole("status", { name: "Sincronização ativa" });

    await expect(banner).toBeVisible();
    await expect(banner).toHaveClass("clv-alert--size-sm");
    await expect(banner.querySelector(".clv-alert__icon svg")).toBeVisible();
  },
};

export const EstadosSemanticos: Story = {
  name: "Estados semânticos",
  render: () => (
    <div className="clv-story-stack">
      <InlineBanner status="info" title="Informação">
        O acompanhamento está disponível para toda a equipe.
      </InlineBanner>
      <InlineBanner status="success" title="Tudo certo">
        A configuração foi validada.
      </InlineBanner>
      <InlineBanner status="warning" title="Atenção">
        Revise os dados antes de continuar.
      </InlineBanner>
      <InlineBanner status="danger" title="Ação necessária">
        Corrija os campos indicados.
      </InlineBanner>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole("status")).toHaveLength(2);
    await expect(canvas.getAllByRole("alert")).toHaveLength(2);
    await expect(canvasElement.querySelectorAll(".clv-alert__icon svg")).toHaveLength(4);
    await expect(canvas.getByRole("alert", { name: "Ação necessária" })).toBeVisible();
  },
};

export const ComAcao: Story = {
  name: "Com ação",
  args: {
    action: (
      <Button onClick={onReview} size="xs" variant="surface">
        Revisar agora
      </Button>
    ),
    children: "Há informações pendentes nesta etapa.",
    status: "warning",
    title: "Revisão necessária",
  },
  play: async ({ canvasElement }) => {
    const banner = within(canvasElement).getByRole("alert", { name: "Revisão necessária" });
    const action = within(canvasElement).getByRole("button", { name: "Revisar agora" });

    await expect(banner.querySelector(".clv-alert__message")).not.toContainElement(action);
    await expect(banner.querySelector(".clv-alert__actions")).toContainElement(action);
    await expect(action).toHaveClass("clv-button--size-xs");
    onReview.mockClear();
    await userEvent.tab();
    await expect(action).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(onReview).toHaveBeenCalledOnce();
  },
};
