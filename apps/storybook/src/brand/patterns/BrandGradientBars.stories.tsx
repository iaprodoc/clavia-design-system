import { BrandPanel, Button, ClaviaLogo } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { BrandGradientBars } from "./BrandGradientBars";
import "./brand-gradient-bars.css";

const meta = {
  title: "Visão geral/Marca/Padrões/Motivo gráfico em gradiente",
  component: BrandGradientBars,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Exploração do motivo gráfico em gradiente da Clavia. A composição reutiliza BrandPanel, Button glass e ClaviaLogo do inventário atual. As seis faixas movem seus gradientes em direções alternadas, respeitam redução de movimento e ainda não fazem parte da API pública do Design System.",
      },
    },
  },
  argTypes: {
    className: {
      table: { disable: true },
    },
    motion: {
      control: "inline-radio",
      options: ["animated", "still"],
      description: "Alterna entre o movimento ambiente e a composição estática.",
    },
  },
  args: {
    motion: "animated",
  },
} satisfies Meta<typeof BrandGradientBars>;

export default meta;

type Story = StoryObj<typeof meta>;

function BrandGradientPiece({ motion }: { motion: "animated" | "still" }) {
  return (
    <article className="clv-brand-gradient-piece">
      <BrandGradientBars className="clv-brand-gradient-piece__bars" motion={motion} />
      <span aria-hidden="true" className="clv-brand-gradient-piece__backplate" />
      <BrandPanel
        className="clv-brand-gradient-piece__panel"
        description="www.clavia.com"
        headingAs="h1"
        title="Bom médico com agenda vazia é o maior desperdício do mercado de saúde."
      />
      <Button className="clv-brand-gradient-piece__action" variant="glass">
        Saiba mais
      </Button>
      <ClaviaLogo
        aria-label="Clavia"
        className="clv-brand-gradient-piece__logo"
        tone="inverse"
        width={76}
      />
    </article>
  );
}

async function verifyGradientBars(canvasElement: HTMLElement, motion: "animated" | "still") {
  const motif = canvasElement.querySelector<HTMLElement>(".clv-brand-gradient-bars");
  const bars = canvasElement.querySelectorAll<HTMLElement>(".clv-brand-gradient-bars__bar");
  const canvas = within(canvasElement);
  const title = canvas.getByRole("heading", {
    name: "Bom médico com agenda vazia é o maior desperdício do mercado de saúde.",
  });
  const domain = canvas.getByText("www.clavia.com");
  const panelContent = canvasElement.querySelector<HTMLElement>(
    ".clv-brand-gradient-piece__panel .clv-brand-panel__content",
  );

  if (!motif) {
    throw new Error("Motivo gráfico em gradiente não encontrado.");
  }

  if (!panelContent) {
    throw new Error("Conteúdo do painel não encontrado.");
  }

  await expect(motif).toHaveAttribute("aria-hidden", "true");
  await expect(motif).toHaveAttribute("data-motion", motion);
  await expect(bars).toHaveLength(6);
  await expect(getComputedStyle(motif).gridTemplateColumns.split(" ")).toHaveLength(6);

  for (let index = 0; index < bars.length - 1; index += 1) {
    const currentBar = bars[index];
    const nextBar = bars[index + 1];

    if (!currentBar || !nextBar) {
      throw new Error("Faixas adjacentes do motivo gráfico não encontradas.");
    }

    await expect(
      currentBar.getBoundingClientRect().right - nextBar.getBoundingClientRect().left,
    ).toBeGreaterThanOrEqual(0.5);
  }

  await expect(title).toBeVisible();
  await expect(getComputedStyle(title).fontWeight).toBe("300");
  await expect(domain).toBeVisible();
  await expect(getComputedStyle(domain).fontWeight).toBe("300");
  await expect(getComputedStyle(domain).color).toBe("rgb(203, 219, 234)");
  await expect(getComputedStyle(panelContent).rowGap).toBe("12px");
  await expect(canvas.getByRole("button", { name: "Saiba mais" })).toHaveClass("clv-button--glass");
  await expect(canvas.getByRole("img", { name: "Clavia" })).toHaveAttribute("data-tone", "inverse");

  const secondBarLayer = getComputedStyle(bars[1] as HTMLElement, "::before");
  const thirdBarLayer = getComputedStyle(bars[2] as HTMLElement, "::before");

  if (motion === "animated") {
    await expect(secondBarLayer.animationName).toBe("clv-brand-gradient-bar-drift");
    await expect(secondBarLayer.animationDirection).toBe("alternate");
    await expect(thirdBarLayer.animationDirection).toBe("alternate-reverse");
    await expect(Number.parseFloat(secondBarLayer.animationDuration)).toBeLessThan(7);
  } else {
    await expect(secondBarLayer.animationName).toBe("none");
    await expect(thirdBarLayer.animationName).toBe("none");
  }
}

export const MovimentoAlternado: Story = {
  name: "Peça de marca animada",
  render: ({ motion = "animated" }) => (
    <main className="clv-brand-gradient-bars-story">
      <BrandGradientPiece motion={motion} />
    </main>
  ),
  play: async ({ args, canvasElement }) =>
    verifyGradientBars(canvasElement, args.motion ?? "animated"),
};

export const ComposicaoEstatica: Story = {
  name: "Composição estática",
  args: {
    motion: "still",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Fallback estático para contextos sem animação, capturas e validação da composição-base. Pessoas que solicitam redução de movimento recebem automaticamente este comportamento, mesmo quando a propriedade está em `animated`.",
      },
    },
  },
  render: ({ motion = "still" }) => (
    <main className="clv-brand-gradient-bars-story">
      <BrandGradientPiece motion={motion} />
    </main>
  ),
  play: async ({ canvasElement }) => verifyGradientBars(canvasElement, "still"),
};
