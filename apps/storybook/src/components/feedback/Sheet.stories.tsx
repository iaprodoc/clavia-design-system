import { Button, Sheet } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

const longContent = Array.from({ length: 20 }, (_, index) => index + 1).map((detail) => (
  <p key={`detail-${detail}`}>
    Detalhe operacional fictício {detail} para verificar a rolagem do painel.
  </p>
));

const meta = {
  component: Sheet,
  parameters: {
    docs: {
      description: {
        component:
          "Use Sheet para inspecionar ou editar um contexto sem abandonar a tela. Escolha o lado pela origem e pela continuidade do fluxo; conteúdo longo rola dentro da superfície. Não use como confirmação destrutiva.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Feedback/Sheet",
} satisfies Meta<typeof Sheet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const LateralDireita: Story = {
  args: {
    actions: <Button>Salvar alterações</Button>,
    children: "Use a Sheet para inspecionar ou editar um contexto sem abandonar a tela atual.",
    description: "As alterações permanecem no fluxo que abriu este painel.",
    title: "Detalhes do projeto",
    trigger: "Abrir detalhes",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Abrir detalhes" });
    await userEvent.click(trigger);

    const body = within(canvasElement.ownerDocument.body);
    const sheet = body.getByRole("dialog", { name: "Detalhes do projeto" });
    const overlay = sheet.closest(".clv-sheet__overlay");
    const style = getComputedStyle(sheet);

    await waitFor(() => expect(sheet).toBeVisible());
    await expect(style.padding).toBe("20px");
    await expect(style.gap).toBe("20px");
    await expect(style.borderRadius).not.toBe("0px");
    await expect(style.fontFamily).toContain("Sora Variable");
    await expect(overlay).not.toBeNull();
    await expect(getComputedStyle(overlay as Element).zIndex).toBe("50");

    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(body.queryByRole("dialog", { name: "Detalhes do projeto" })).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const LateralEsquerda: Story = {
  args: {
    children: "A posição à esquerda é útil para contextos de navegação complementar.",
    side: "left",
    title: "Contexto da navegação",
    trigger: "Abrir contexto",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Abrir contexto" }));
    const sheet = within(canvasElement.ownerDocument.body).getByRole("dialog", {
      name: "Contexto da navegação",
    });

    await expect(sheet).toHaveClass("clv-sheet--left");
    await expect(getComputedStyle(sheet).borderRadius).not.toBe("0px");
  },
};

export const InferiorComConteudoExtenso: Story = {
  args: {
    actions: <Button>Concluir</Button>,
    children: longContent,
    side: "bottom",
    title: "Atividade do projeto",
    trigger: "Ver atividade",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Ver atividade" }));
    const sheet = within(canvasElement.ownerDocument.body).getByRole("dialog", {
      name: "Atividade do projeto",
    });
    const style = getComputedStyle(sheet);

    await expect(sheet).toHaveClass("clv-sheet--bottom");
    await expect(style.overflowY).toBe("auto");
    await expect(style.borderRadius).not.toBe("0px");
    const bounds = sheet.getBoundingClientRect();
    await expect(
      Math.abs(bounds.left + bounds.width / 2 - window.innerWidth / 2),
    ).toBeLessThanOrEqual(1);
  },
};

export const ControladaAberta: Story = {
  args: {
    isOpen: true,
    onOpenChange: () => undefined,
    title: "Sheet controlada",
    trigger: "Abrir Sheet controlada",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `isOpen` com `onOpenChange` quando a abertura fizer parte de um estado externo. Não forneça `defaultOpen` ao mesmo tempo.",
      },
    },
  },
};

export const FechamentoExplicitamenteControlado: Story = {
  name: "Fechamento explicitamente controlado",
  args: {
    description: "O produto decide quando este painel pode ser dispensado.",
    isDismissable: false,
    isKeyboardDismissDisabled: true,
    isOpen: true,
    onOpenChange: () => undefined,
    title: "Painel protegido",
    trigger: "Abrir painel protegido",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use esta política para uma etapa que não pode ser interrompida. Inclua uma saída explícita no conteúdo antes de adotar o bloqueio.",
      },
    },
  },
};
