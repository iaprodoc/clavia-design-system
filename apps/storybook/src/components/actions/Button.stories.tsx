import { ChevronLeftIcon, ChevronRightIcon, LoaderIcon, WhatsAppIcon } from "@clavia-ds/icons";
import { Button, LinkButton } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const meta = {
  args: {
    children: "Continuar",
    size: "md",
    variant: "primary",
  },
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          "Ação base da Clavia com variantes funcionais, quatro tamanhos, ícones, largura total e estados de disponibilidade. Use `xs` apenas para ações auxiliares em superfícies densas no desktop, como Alert inline; `sm` é o menor tamanho indicado para formulários e fluxos mobile. Use primary para a ação principal; secondary, tertiary, outline e ghost para níveis secundários; danger e danger-soft para ações destrutivas. Gradient, glass e adaptive-glass pertencem à camada expressiva da marca e devem ficar fora de formulários e operações críticas.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Ações/Button",
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Continuar" });

    await expect(getComputedStyle(button).backgroundColor).toBe("rgb(34, 78, 130)");
    await expect(getComputedStyle(button).color).toBe("rgb(255, 255, 255)");
  },
};

export const ComBotaoDeLink: Story = {
  name: "Com botão de link",
  render: () => (
    <LinkButton href="#orientacoes" variant="secondary">
      Ver orientações
    </LinkButton>
  ),
};

export const Variantes: Story = {
  render: () => (
    <div className="clv-story-stack clv-story-button-stack">
      <Button trailingIcon={<ChevronRightIcon />}>Continuar</Button>
      <Button trailingIcon={<ChevronRightIcon />} variant="secondary">
        Ver opções
      </Button>
      <Button trailingIcon={<ChevronRightIcon />} variant="tertiary">
        Revisar agenda
      </Button>
      <Button variant="outline">Ver detalhes</Button>
      <Button variant="ghost">Voltar</Button>
      <Button variant="danger">Excluir configuração</Button>
      <Button variant="danger-soft">Excluir rascunho</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const primaryButton = canvas.getByRole("button", { name: "Continuar" });
    const outlineButton = canvas.getByRole("button", { name: "Ver detalhes" });
    const dangerSoftButton = canvas.getByRole("button", { name: "Excluir rascunho" });

    await expect(primaryButton).toHaveClass("clv-button--primary");
    await expect(outlineButton).toHaveClass("clv-button--outline");
    await expect(dangerSoftButton).toHaveClass("clv-button--danger-soft");
  },
};

export const Expressivas: Story = {
  name: "Expressivas",
  render: () => (
    <div className="clv-story-stack clv-story-button-stack">
      <Button variant="text">Cancelar</Button>
      <Button trailingIcon={<ChevronRightIcon />} variant="gradient">
        Finalizar onboarding
      </Button>
    </div>
  ),
};

export const ComIcones: Story = {
  name: "Com ícones",
  render: () => (
    <div className="clv-story-stack clv-story-button-stack">
      <Button leadingIcon={<ChevronLeftIcon />} trailingIcon={<ChevronRightIcon />}>
        Continuar
      </Button>
      <Button leadingIcon={<ChevronLeftIcon />} variant="secondary">
        Voltar
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const both = canvas.getByRole("button", { name: "Continuar" });
    const leadingOnly = canvas.getByRole("button", { name: "Voltar" });
    const bothStyles = getComputedStyle(both);
    const leadingOnlyStyles = getComputedStyle(leadingOnly);

    await expect(bothStyles.paddingInlineStart).toBe("12px");
    await expect(bothStyles.paddingInlineEnd).toBe("12px");
    await expect(leadingOnlyStyles.paddingInlineStart).toBe("12px");
    await expect(leadingOnlyStyles.paddingInlineEnd).toBe("24px");
  },
};

export const SomenteComIcone: Story = {
  name: "Somente com ícone",
  args: {
    "aria-label": "Avançar",
    children: <ChevronRightIcon />,
    isIconOnly: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Avançar" });
    const icon = button.querySelector("svg");

    if (!icon) throw new Error("O botão somente com ícone deve renderizar o ícone.");

    const buttonBounds = button.getBoundingClientRect();
    const iconBounds = icon.getBoundingClientRect();

    await expect(
      Math.abs(
        buttonBounds.top + buttonBounds.height / 2 - (iconBounds.top + iconBounds.height / 2),
      ),
    ).toBeLessThanOrEqual(0.5);
  },
};

export const ComSpinner: Story = {
  name: "Com Spinner",
  render: () => (
    <Button leadingIcon={<LoaderIcon />} isDisabled>
      Preparando
    </Button>
  ),
};

export const LarguraTotal: Story = {
  name: "Largura total",
  args: {
    children: "Continuar",
    fullWidth: true,
  },
  render: (args) => (
    <div style={{ inlineSize: "100%", maxInlineSize: "22rem" }}>
      <Button {...args} />
    </div>
  ),
};

export const TamanhosEIcones: Story = {
  name: "Tamanhos e ícones",
  render: () => (
    <div className="clv-story-stack clv-story-button-stack">
      <Button
        leadingIcon={<ChevronLeftIcon />}
        size="lg"
        trailingIcon={<ChevronRightIcon />}
        variant="secondary"
      >
        Grande · 60 px
      </Button>
      <Button
        leadingIcon={<ChevronLeftIcon />}
        trailingIcon={<ChevronRightIcon />}
        variant="secondary"
      >
        Médio · 52 px
      </Button>
      <Button
        leadingIcon={<ChevronLeftIcon />}
        size="sm"
        trailingIcon={<ChevronRightIcon />}
        variant="secondary"
      >
        Pequeno · 44 px
      </Button>
      <Button size="xs" variant="surface">
        Extra compacto · 36 px
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const large = canvas.getByRole("button", { name: "Grande · 60 px" });
    const medium = canvas.getByRole("button", { name: "Médio · 52 px" });
    const small = canvas.getByRole("button", { name: "Pequeno · 44 px" });
    const extraSmall = canvas.getByRole("button", { name: "Extra compacto · 36 px" });

    await expect(getComputedStyle(large).minHeight).toBe("60px");
    await expect(getComputedStyle(medium).minHeight).toBe("52px");
    await expect(getComputedStyle(small).minHeight).toBe("44px");
    await expect(getComputedStyle(extraSmall).minHeight).toBe("36px");
    await expect(large.getBoundingClientRect().height).toBe(60);
    await expect(medium.getBoundingClientRect().height).toBe(52);
    await expect(small.getBoundingClientRect().height).toBe(44);
    await expect(extraSmall.getBoundingClientRect().height).toBe(36);
    await expect(getComputedStyle(large).borderRadius).toBe("999px");
    await expect(getComputedStyle(medium).borderRadius).toBe("999px");
    await expect(getComputedStyle(small).borderRadius).toBe("999px");
    await expect(getComputedStyle(extraSmall).borderRadius).toBe("999px");
    await expect(getComputedStyle(large).paddingInlineStart).toBe("16px");
    await expect(getComputedStyle(large).paddingInlineEnd).toBe("16px");
    await expect(getComputedStyle(medium).paddingInlineStart).toBe("12px");
    await expect(getComputedStyle(medium).paddingInlineEnd).toBe("12px");
    await expect(getComputedStyle(extraSmall).paddingInlineStart).toBe("12px");
    await expect(getComputedStyle(extraSmall).paddingInlineEnd).toBe("12px");
    await expect(getComputedStyle(small).paddingInlineStart).toBe("8px");
    await expect(getComputedStyle(small).paddingInlineEnd).toBe("8px");
    await expect(large.querySelectorAll(".clv-button__icon")).toHaveLength(2);
  },
};

export const ComEstadoDeCarregamento: Story = {
  name: "Com estado de carregamento",
  render: () => (
    <div className="clv-story-stack">
      <Button disabled>Indisponível</Button>
      <Button disabled variant="ghost">
        Voltar indisponível
      </Button>
      <Button isLoading>Salvando</Button>
      <Button isLoading variant="secondary">
        Carregando opções
      </Button>
      <Button isPending variant="danger-soft">
        Excluindo
      </Button>
    </div>
  ),
};

export const ComBotaoSocial: Story = {
  name: "Com botão social",
  render: () => (
    <Button leadingIcon={<WhatsAppIcon />} variant="secondary">
      Continuar pelo WhatsApp
    </Button>
  ),
};

export const AcaoPrincipalMobile: Story = {
  args: {
    children: "Continuar no celular",
    fullWidth: true,
  },
  name: "Ação principal no mobile",
  render: (args) => (
    <div style={{ inlineSize: "100%" }}>
      <Button {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use fullWidth quando a ação principal precisar ocupar a coluna do formulário em viewport compacto.",
      },
    },
    viewport: { defaultViewport: "mobile1" },
  },
};

export const Vidro: Story = {
  name: "Vidro",
  parameters: {
    docs: {
      description: {
        story:
          "A variante glass combina névoa azulada, borda refrativa, reflexo interno e profundidade sobre uma superfície limpa. Ela preserva a escala, o padding e a API de ícones do Button; use em momentos expressivos, fora de formulários e ações críticas.",
      },
    },
  },
  render: () => (
    <div className="clv-story-glass-button-preview">
      <Button size="sm" variant="glass">
        Pequeno
      </Button>
      <Button trailingIcon={<ChevronRightIcon />} variant="glass">
        Gerar
      </Button>
      <Button size="lg" variant="glass">
        Enviar
      </Button>
      <Button aria-label="Avançar" isIconOnly variant="glass">
        <ChevronRightIcon />
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const small = canvas.getByRole("button", { name: "Pequeno" });
    const medium = canvas.getByRole("button", { name: "Gerar" });
    const large = canvas.getByRole("button", { name: "Enviar" });

    await expect(small.getBoundingClientRect().height).toBe(44);
    await expect(medium.getBoundingClientRect().height).toBe(52);
    await expect(large.getBoundingClientRect().height).toBe(60);
    await expect(getComputedStyle(medium).color).toBe("rgb(2, 24, 38)");
    await expect(getComputedStyle(medium).backgroundImage).toContain("linear-gradient");
    await expect(getComputedStyle(medium).transitionProperty).toContain("text-shadow");
  },
};

export const VidroAdaptativo: Story = {
  name: "Vidro adaptativo",
  parameters: {
    docs: {
      description: {
        story:
          'O estado de repouso usa 16% de opacidade, blur de 16 px, contorno e reflexos internos, sem sombra projetada. `tone="default"` mantém o vidro quase neutro sobre fundos claros; `tone="on-dark"` ativa o acabamento azul-neblina e texto claro. Hover e active aumentam apenas a presença da superfície. O foco continua visível e o estado desabilitado preserva a leitura do contexto.',
      },
    },
  },
  render: () => (
    <div className="clv-story-adaptive-glass-buttons">
      <div className="clv-story-adaptive-glass-buttons__surface">
        <Button variant="adaptive-glass">Sobre fundo claro</Button>
      </div>
      <div className="clv-story-adaptive-glass-buttons__surface clv-story-adaptive-glass-buttons__surface--dark">
        <Button tone="on-dark" variant="adaptive-glass">
          Sobre fundo escuro
        </Button>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const onLight = canvas.getByRole("button", { name: "Sobre fundo claro" });
    const onDark = canvas.getByRole("button", { name: "Sobre fundo escuro" });
    const lightStyles = getComputedStyle(onLight);
    const darkStyles = getComputedStyle(onDark);

    await expect(lightStyles.backdropFilter).toContain("blur(16px)");
    await expect(lightStyles.backgroundColor).toBe("rgba(244, 248, 252, 0.16)");
    await expect(lightStyles.borderColor).toBe("rgba(255, 255, 255, 0.64)");
    await expect(lightStyles.color).toBe("rgb(2, 24, 38)");
    await expect(lightStyles.boxShadow).not.toContain("8px 24px");
    await expect(darkStyles.borderColor).toBe("rgba(161, 198, 242, 0.56)");
    await expect(darkStyles.color).toBe("rgb(255, 255, 255)");
    await expect(darkStyles.boxShadow).not.toContain("8px 24px");
  },
};
