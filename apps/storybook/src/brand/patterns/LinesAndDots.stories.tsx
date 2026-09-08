import { CheckIcon } from "@clavia-ds/icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import "./brand-guides.css";
import { BrandGuidePattern } from "./BrandGuidePattern";

const meta = {
  title: "Visão geral/Marca/Padrões/Linhas e pontos",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

type BrandGuidesTone = "dark" | "light";

function BrandGuidesLayout({ tone }: { tone: BrandGuidesTone }) {
  return (
    <main className={`clv-brand-guides-story clv-brand-guides-story--${tone}`}>
      <section aria-labelledby="brand-guides-title" className="clv-brand-guides-frame">
        <BrandGuidePattern />

        <div className="clv-brand-guides-frame__grid">
          <header className="clv-brand-guides-cell clv-brand-guides-cell--intro">
            <p className="clv-brand-guides-eyebrow">Exploração de layout</p>
            <h1 id="brand-guides-title">
              Tecnologia <br />
              que parece humana.
            </h1>
          </header>

          <section aria-labelledby="brand-guides-structure" className="clv-brand-guides-cell">
            <p className="clv-brand-guides-eyebrow">Estrutura</p>
            <h2 id="brand-guides-structure">O grid aparece só onde ajuda a leitura.</h2>
            <p>
              Os trilhos delimitam o container. Os pontos marcam encontros e transições, sem se
              transformar em textura de fundo.
            </p>
          </section>

          <section aria-labelledby="brand-guides-use" className="clv-brand-guides-cell">
            <p className="clv-brand-guides-eyebrow">Onde usar</p>
            <h2 id="brand-guides-use">Momentos de marca com pouco conteúdo.</h2>
            <ul>
              <li>
                <CheckIcon aria-hidden="true" className="clv-brand-guides-check" />
                <span>Abertura ou conclusão de uma etapa</span>
              </li>
              <li>
                <CheckIcon aria-hidden="true" className="clv-brand-guides-check" />
                <span>Resumo antes de uma próxima ação</span>
              </li>
              <li>
                <CheckIcon aria-hidden="true" className="clv-brand-guides-check" />
                <span>Seções editoriais e institucionais</span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="brand-guides-avoid" className="clv-brand-guides-cell">
            <p className="clv-brand-guides-eyebrow">Onde evitar</p>
            <h2 id="brand-guides-avoid">A operação continua limpa.</h2>
            <p>
              Formulários, tabelas, alertas e áreas densas não recebem essa camada. Nesses
              contextos, as linhas podem parecer bordas ou estados interativos.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

async function verifyGuideLayout(canvasElement: HTMLElement, tone: BrandGuidesTone) {
  const canvas = within(canvasElement);
  const story = canvasElement.querySelector<HTMLElement>(`.clv-brand-guides-story--${tone}`);
  const frame = canvasElement.querySelector<HTMLElement>(".clv-brand-guides-frame");
  const horizontalLine = canvasElement.querySelector<HTMLElement>(".clv-brand-guides-line--top");
  const rail = canvasElement.querySelector<HTMLElement>(".clv-brand-guides-line--rail-start");
  const nodes = canvasElement.querySelectorAll<HTMLElement>(".clv-brand-guides-node");
  const dots = canvasElement.querySelectorAll<HTMLElement>(".clv-brand-guides-node__dot");
  const checks = canvasElement.querySelectorAll<SVGElement>(".clv-brand-guides-check");
  const cells = canvasElement.querySelectorAll<HTMLElement>(".clv-brand-guides-cell");

  if (!story || !frame || !horizontalLine || !rail) {
    throw new Error("Estrutura de linhas da marca não encontrada.");
  }

  const title = canvas.getByRole("heading", { name: "Tecnologia que parece humana." });
  const sectionTitle = canvas.getByRole("heading", {
    name: "O grid aparece só onde ajuda a leitura.",
  });
  const description = canvas.getByText(/Os trilhos delimitam o container/);
  const eyebrow = canvas.getByText("Exploração de layout");

  await expect(title).toBeVisible();
  await expect(title.querySelector("br")).not.toBeNull();
  const titleStyles = getComputedStyle(title);
  const titleSize = Number.parseFloat(titleStyles.fontSize);
  const titleLineHeight = Number.parseFloat(titleStyles.lineHeight);
  const sectionTitleSize = Number.parseFloat(getComputedStyle(sectionTitle).fontSize);

  await expect(titleSize).toBeGreaterThanOrEqual(36);
  await expect(titleSize).toBeLessThanOrEqual(64);
  await expect(getComputedStyle(title).fontWeight).toBe("300");
  await expect(Math.abs(titleLineHeight / titleSize - 1.05)).toBeLessThanOrEqual(0.01);
  await expect(sectionTitleSize).toBeGreaterThanOrEqual(26);
  await expect(sectionTitleSize).toBeLessThanOrEqual(28);
  await expect(getComputedStyle(sectionTitle).fontWeight).toBe("300");
  await expect(getComputedStyle(description).fontWeight).toBe("300");
  await expect(getComputedStyle(eyebrow).fontWeight).toBe("300");
  await expect(getComputedStyle(frame).borderInlineStartWidth).toBe("0px");
  await expect(getComputedStyle(horizontalLine).height).toBe("1px");
  await expect(getComputedStyle(horizontalLine).maskImage).not.toBe("none");
  await expect(getComputedStyle(rail).maskImage).not.toBe("none");
  await expect(cells).toHaveLength(4);
  await expect(getComputedStyle(cells[0] as HTMLElement).alignContent).toBe("center");
  await expect(nodes).toHaveLength(9);
  await expect(dots).toHaveLength(9);
  await expect(checks).toHaveLength(3);
  await expect(checks[0]).toHaveAttribute("aria-hidden", "true");
  await expect(getComputedStyle(checks[0] as SVGElement).width).toBe("16px");
  await expect(getComputedStyle(dots[0] as HTMLElement).width).toBe("8px");
  await expect(getComputedStyle(dots[0] as HTMLElement).backgroundColor).toBe(
    getComputedStyle(horizontalLine).backgroundColor,
  );
  await expect(frame.querySelector("[aria-hidden='true']")).not.toBeNull();

  if (tone === "light") {
    await expect(getComputedStyle(story).backgroundColor).toBe("rgb(252, 252, 251)");
    await expect(getComputedStyle(story).color).toBe("rgb(2, 24, 38)");
    await expect(getComputedStyle(horizontalLine).backgroundColor).toBe("rgb(217, 222, 223)");
    await expect(getComputedStyle(dots[0] as HTMLElement).backgroundColor).toBe(
      "rgb(217, 222, 223)",
    );
    await expect(getComputedStyle(checks[0] as SVGElement).color).toBe("rgb(34, 78, 130)");
  }
}

export const EstruturaDeLayout: Story = {
  name: "Estrutura de layout — fundo escuro",
  parameters: {
    docs: {
      description: {
        story:
          "Exploração não consolidada para layouts de marca. As linhas definem o container e as divisões principais; nos encontros, um recorte transparente de 20 px recebe um ponto central de 8 px na mesma cor da linha. Use em aberturas, conclusões e resumos com pouco conteúdo. Evite formulários, tabelas, alertas e telas operacionais densas.",
      },
    },
  },
  render: () => <BrandGuidesLayout tone="dark" />,
  play: async ({ canvasElement }) => verifyGuideLayout(canvasElement, "dark"),
};

export const EstruturaDeLayoutClara: Story = {
  name: "Estrutura de layout — fundo claro",
  parameters: {
    docs: {
      description: {
        story:
          "Variação clara da exploração estrutural. Linhas e pontos usam a borda sutil da Clavia; o recorte transparente mantém o encontro válido também sobre superfícies com gradiente. Use nas mesmas situações editoriais da versão escura e preserve as áreas operacionais sem decoração.",
      },
    },
  },
  render: () => <BrandGuidesLayout tone="light" />,
  play: async ({ canvasElement }) => verifyGuideLayout(canvasElement, "light"),
};
