import { ClaviaLogo } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { BrandBlurField } from "./BrandBlurField";
import "./brand-blur-field.css";

const meta = {
  title: "Visão geral/Marca/Padrões/Campo cromático desfocado",
  component: BrandBlurField,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Exploração do campo cromático da Clavia. A composição sobrepõe os dois vetores desfocados originais, reutiliza ClaviaLogo e combina guias laterais com uma linha horizontal. Os encontros são recortes transparentes que preservam o gradiente. O resultado é um recurso editorial de marca para capas, campanhas e apresentações, não um token funcional de superfície.",
      },
    },
  },
  argTypes: {
    className: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof BrandBlurField>;

export default meta;

type Story = StoryObj<typeof meta>;

function BrandBlurComposition() {
  return (
    <article aria-labelledby="brand-blur-title" className="clv-brand-blur-piece">
      <BrandBlurField className="clv-brand-blur-piece__field" />
      <div aria-hidden="true" className="clv-brand-blur-piece__guide-frame">
        <span className="clv-brand-blur-piece__guide-dot clv-brand-blur-piece__guide-dot--start" />
        <span className="clv-brand-blur-piece__guide-dot clv-brand-blur-piece__guide-dot--end" />
      </div>

      <ClaviaLogo
        aria-label="Clavia, Inteligência Comercial"
        className="clv-brand-blur-piece__logo"
        lockup="tagline"
        tone="inverse"
      />

      <h1 className="clv-brand-blur-piece__title" id="brand-blur-title">
        Escalando sua agenda
      </h1>

      <p className="clv-brand-blur-piece__description">
        Enquanto você atende, a Clavia trabalha. Nossa inteligência artificial responde, agenda,
        confirma e acompanha cada paciente com a naturalidade de um atendimento humano. Mas não
        paramos na automação.
      </p>
    </article>
  );
}

export const ComposicaoDeMarca: Story = {
  name: "Composição de marca",
  render: () => (
    <main className="clv-brand-blur-story">
      <BrandBlurComposition />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvasElement.querySelector<HTMLElement>(".clv-brand-blur-field");
    const layers = canvasElement.querySelectorAll<HTMLImageElement>(".clv-brand-blur-field__layer");
    const guideFrame = canvasElement.querySelector<HTMLElement>(
      ".clv-brand-blur-piece__guide-frame",
    );
    const guideLines = canvasElement.querySelectorAll<HTMLElement>(".clv-brand-guides-line");
    const guideNodes = canvasElement.querySelectorAll<HTMLElement>(".clv-brand-guides-node");
    const guideCutouts = canvasElement.querySelectorAll<HTMLElement>(
      ".clv-brand-blur-piece__guide-cutout",
    );
    const guideDots = canvasElement.querySelectorAll<HTMLElement>(
      ".clv-brand-blur-piece__guide-dot",
    );
    const story = canvasElement.querySelector<HTMLElement>(".clv-brand-blur-story");
    const piece = canvasElement.querySelector<HTMLElement>(".clv-brand-blur-piece");
    const title = canvas.getByRole("heading", { name: "Escalando sua agenda" });
    const logo = canvas.getByRole("img", { name: "Clavia, Inteligência Comercial" });
    const description = canvas.getByText(/Enquanto você atende, a Clavia trabalha/);

    if (!field || !guideFrame || !story || !piece) {
      throw new Error("Campo cromático ou moldura lateral não encontrados.");
    }

    await expect(field).toHaveAttribute("aria-hidden", "true");
    await expect(layers).toHaveLength(2);
    await expect(layers[0]).toHaveAttribute("src", "/clavia-blur-ellipse-lower.svg");
    await expect(layers[1]).toHaveAttribute("src", "/clavia-blur-ellipse-upper.svg");
    await expect(
      getComputedStyle(piece).getPropertyValue("--clv-brand-blur-shape-lift").trim(),
    ).not.toBe("");
    await expect(guideFrame).toHaveAttribute("aria-hidden", "true");
    await expect(guideLines).toHaveLength(0);
    await expect(guideNodes).toHaveLength(0);
    await expect(guideCutouts).toHaveLength(0);
    await expect(guideDots).toHaveLength(2);
    await expect(getComputedStyle(guideFrame).borderInlineStartWidth).toBe("0px");
    await expect(getComputedStyle(guideFrame).borderInlineEndWidth).toBe("0px");
    await expect(getComputedStyle(guideFrame, "::before").backgroundImage).not.toBe("none");
    await expect(getComputedStyle(guideFrame, "::before").maskImage).not.toBe("none");
    await expect(getComputedStyle(guideDots[0] as HTMLElement).backgroundColor).toBe(
      "rgba(255, 255, 255, 0.24)",
    );
    await expect(getComputedStyle(guideDots[0] as HTMLElement).width).toBe("8px");
    await expect(guideFrame.getBoundingClientRect().top).toBe(piece.getBoundingClientRect().top);
    await expect(guideFrame.getBoundingClientRect().bottom).toBe(
      piece.getBoundingClientRect().bottom,
    );
    await expect(piece.getBoundingClientRect().top).toBe(story.getBoundingClientRect().top);
    await expect(piece.getBoundingClientRect().bottom).toBeGreaterThanOrEqual(
      story.getBoundingClientRect().bottom,
    );
    await expect(getComputedStyle(story).alignItems).toBe("flex-start");
    await expect(title).toBeVisible();
    await expect(getComputedStyle(title).fontWeight).toBe("300");
    await expect(getComputedStyle(title).color).toBe("rgba(0, 0, 0, 0)");
    await expect(Number.parseFloat(getComputedStyle(title).paddingBottom)).toBeGreaterThan(0);
    await expect(getComputedStyle(title).transform).not.toBe("none");
    await expect(logo).toHaveAttribute("data-lockup", "tagline");
    await expect(logo).toHaveAttribute("data-tone", "inverse");
    await expect(getComputedStyle(logo).transform).not.toBe("none");
    await expect(description).toBeVisible();
    await expect(getComputedStyle(description).color).toBe("rgb(101, 116, 124)");
    await expect(getComputedStyle(description).fontWeight).toBe("400");
    await expect(getComputedStyle(description).textWrap).toBe("balance");
    await expect(
      getComputedStyle(piece).getPropertyValue("--clv-brand-blur-description-drop").trim(),
    ).not.toBe("");
  },
};
