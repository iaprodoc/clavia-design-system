import { ArrowLeftIcon } from "@clavia-ds/icons";
import { Button, LinkButton, PageHeader } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta = {
  args: {
    actions: (
      <Button size="lg" variant="glass">
        Adicionar pessoa
      </Button>
    ),
    description:
      "Consulte os vínculos e o estado de cada acesso. Identidade, autorização, convites e credenciais continuam no Hub.",
    navigation: undefined,
    size: "default",
    title: "Pessoas, clientes e permissões",
  },
  component: PageHeader,
  decorators: [
    (Story) => (
      <div className="clv-story-page-header">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Cabeçalho para contexto, descrição e ações de uma página. A variante `surface`, usada por padrão com o tamanho `default`, aplica a superfície de marca responsiva aprovada, com conteúdo protegido por uma luz difusa e ação expressiva opcional. `plain` remove a moldura e a imagem; `compact` preserva a apresentação contida. A navegação de retorno fica acima do conteúdo e deve ter nome acessível. Sem ação, o conteúdo ocupa a largura disponível. O eyebrow é opcional e deve acrescentar uma categoria ou etapa curta, sem repetir o título.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Componentes/Layout/PageHeader",
} satisfies Meta<typeof PageHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", {
      level: 1,
      name: "Pessoas, clientes e permissões",
    });
    const description = canvas.getByText(/Consulte os vínculos/);
    const action = canvas.getByRole("button", { name: "Adicionar pessoa" });
    const header = heading.closest("header");

    await expect(header).toHaveAttribute("data-size", "default");
    await expect(header).toHaveAttribute("data-variant", "surface");
    await expect(window.getComputedStyle(header as HTMLElement).backgroundImage).toContain(
      "img-bg-page-header-wide.webp",
    );
    await expect(window.getComputedStyle(header as HTMLElement).backgroundClip).toBe("padding-box");
    await expect(window.getComputedStyle(heading).fontWeight).toBe("500");
    await expect(window.getComputedStyle(description).color).not.toBe(
      window.getComputedStyle(heading).color,
    );
    await expect(action).toHaveClass("clv-button--glass");
    await expect(window.getComputedStyle(action).backdropFilter).toBe("blur(2px)");
    await userEvent.hover(action);
    await new Promise((resolve) => window.setTimeout(resolve, 250));
    await expect(window.getComputedStyle(action).backdropFilter).toBe("blur(2px)");
    await expect(window.getComputedStyle(header as HTMLElement, "::before").filter).toContain(
      "blur",
    );
  },
};

export const ComContextoCurto: Story = {
  name: "Com contexto curto",
  args: {
    eyebrow: "Visão geral",
    navigation: (
      <LinkButton
        aria-label="Voltar ao processo"
        className="clv-page-header__back-link"
        href="#processo"
      >
        <ArrowLeftIcon />
      </LinkButton>
    ),
  },
};

export const SimplesComCta: Story = {
  name: "Simples com CTA à direita",
  args: {
    actions: <Button>Nova análise</Button>,
    description: "Localize uma conversa, filtre os resultados e revise a próxima recomendação.",
    navigation: undefined,
    title: "Análise de conversas",
    variant: "plain",
  },
};

export const SimplesSemCta: Story = {
  name: "Simples sem CTA",
  args: {
    actions: undefined,
    description: "Localize uma conversa, filtre os resultados e revise a próxima recomendação.",
    navigation: undefined,
    title: "Análise de conversas",
    variant: "plain",
  },
};

export const Compacto: Story = {
  args: {
    actions: undefined,
    description: "Todas as alterações desta etapa são salvas durante o preenchimento.",
    eyebrow: "Etapa 5",
    navigation: undefined,
    size: "compact",
    title: "Conectar WhatsApp",
  },
};
