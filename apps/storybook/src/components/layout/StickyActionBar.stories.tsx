import { Button, SaveStatus, StickyActionBar } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect } from "storybook/test";

function ActionBarPreview({
  children,
  surface = "light",
}: {
  children: ReactNode;
  surface?: "dark" | "light";
}) {
  return (
    <div
      className={`clv-story-sticky-action-bar-preview clv-story-sticky-action-bar-preview--${surface}`}
    >
      <div aria-hidden="true" className="clv-story-sticky-action-bar-backdrop">
        <span className="clv-story-sticky-action-bar-backdrop__tile" />
        <span className="clv-story-sticky-action-bar-backdrop__tile" />
        <span className="clv-story-sticky-action-bar-backdrop__tile" />
      </div>
      {children}
    </div>
  );
}

const meta = {
  args: {
    previousAction: <Button variant="ghost">Anterior</Button>,
    primaryAction: <Button>Próximo</Button>,
    status: <SaveStatus lastSavedAt="10:42" status="saved" />,
  },
  argTypes: {
    tone: {
      control: "select",
      description:
        "Use `default` sobre superfícies claras e `on-dark` sobre fundos escuros ou coloridos. O tom contextual troca os tokens das ações e dos estados sem exigir estilos no fluxo.",
      options: ["default", "on-dark"],
    },
  },
  component: StickyActionBar,
  parameters: {
    docs: {
      description: {
        component:
          'Dock translúcida persistente para navegação e estado de salvamento de uma etapa. A superfície usa 16% de opacidade e backdrop blur de 16 px. Todos os estados do `SaveStatus` mantêm o centro estável e emitem ondas na própria cor semântica, que se dissipam como um radar; o efeito é removido com movimento reduzido. Use `tone="default"` sobre superfícies claras: o contorno e os reflexos ficam quase neutros. Use `tone="on-dark"` sobre fundos escuros ou coloridos: a superfície recebe o acabamento azul-neblina e a ação principal usa o branco semântico de `surface.raised`. Não aplique cores diretamente nos elementos internos e não use a dock para ações soltas, como compartilhar ou excluir.',
      },
    },
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "Componentes/Layout/StickyActionBar",
} satisfies Meta<typeof StickyActionBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Salvo: Story = {
  render: (args) => (
    <ActionBarPreview>
      <StickyActionBar {...args} />
    </ActionBarPreview>
  ),
  play: async ({ canvasElement }) => {
    const surface = canvasElement.querySelector<HTMLElement>(".clv-sticky-action-bar__inner");

    if (!surface) {
      throw new Error("Superfície padrão do StickyActionBar não encontrada.");
    }

    const styles = getComputedStyle(surface);

    await expect(styles.borderColor).toBe("rgba(255, 255, 255, 0.64)");
    await expect(styles.boxShadow).toContain("rgba(34, 78, 130, 0.08)");
  },
};

export const SobreFundoEscuro: Story = {
  name: "Sobre fundo escuro",
  parameters: {
    docs: {
      description: {
        story:
          "Contrato para fundos escuros: a ação principal usa `surface.raised` com texto escuro; a ação anterior mantém fundo transparente, texto branco e borda branca a 56%; o estado salvo usa o verde claro contextual. Hover, active e disabled seguem os tokens `stickyActionBar.onDark`.",
      },
    },
  },
  render: (args) => (
    <ActionBarPreview surface="dark">
      <StickyActionBar {...args} tone="on-dark" />
    </ActionBarPreview>
  ),
  play: async ({ canvasElement }) => {
    const surface = canvasElement.querySelector<HTMLElement>(".clv-sticky-action-bar__inner");
    const previousAction = canvasElement.querySelector<HTMLElement>(".clv-button--ghost");
    const primaryAction = canvasElement.querySelector<HTMLElement>(".clv-button--primary");
    const savedStatus = canvasElement.querySelector<HTMLElement>(".clv-save-status--saved");

    if (!surface || !previousAction || !primaryAction || !savedStatus) {
      throw new Error("Estrutura do StickyActionBar sobre fundo escuro não encontrada.");
    }

    const styles = getComputedStyle(surface);

    await expect(styles.backdropFilter).toContain("blur(16px)");
    await expect(styles.backgroundColor).toBe("rgba(244, 248, 252, 0.16)");
    await expect(styles.borderColor).toBe("rgba(161, 198, 242, 0.56)");
    await expect(styles.boxShadow).toContain("rgba(86, 178, 237, 0.18)");
    await expect(getComputedStyle(primaryAction).backgroundColor).toBe("rgb(255, 255, 255)");
    await expect(getComputedStyle(primaryAction).color).toBe("rgb(2, 24, 38)");
    await expect(getComputedStyle(previousAction).color).toBe("rgb(255, 255, 255)");
    await expect(getComputedStyle(previousAction).borderColor).toBe("rgba(255, 255, 255, 0.56)");
    await expect(getComputedStyle(savedStatus).color).toBe("rgb(189, 227, 203)");
  },
};

export const FalhaAoSalvar: Story = {
  args: {
    previousAction: undefined,
    primaryAction: <Button>Finalizar</Button>,
    status: <SaveStatus onRetry={() => undefined} status="error" />,
  },
  render: (args) => (
    <ActionBarPreview>
      <StickyActionBar {...args} />
    </ActionBarPreview>
  ),
};
