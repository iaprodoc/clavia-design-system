import { tokens } from "@clavia-ds/tokens";
import { BrandPanel, Button, SaveStatus, StickyActionBar } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties, ReactNode } from "react";
import { expect, within } from "storybook/test";

import "./effects.css";

const meta = {
  parameters: { layout: "fullscreen" },
  title: "Visão geral/Fundamentos/Effects",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Intro({ children, title }: { children: ReactNode; title: string }) {
  return (
    <header className="clv-effects-page__intro">
      <p className="clv-effects-page__eyebrow">Foundation · effects</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </header>
  );
}

const roles = [
  ["effect.blur.brandSurface", tokens.effect.blur.brandSurface, "Blur discreto do BrandPanel."],
  [
    "effect.blur.glassControl",
    tokens.effect.blur.glassControl,
    "Backdrop de um controle de vidro aprovado.",
  ],
  [
    "effect.blur.floatingSurface",
    tokens.effect.blur.floatingSurface,
    "Backdrop de uma superfície flutuante translúcida.",
  ],
  [
    "effect.blur.brandMedia",
    tokens.effect.blur.brandMedia,
    "Campo de mídia expressiva, pequeno e recortado.",
  ],
  [
    "effect.glow.brand",
    tokens.effect.glow.brand,
    "Luz externa de marca, sem função de profundidade.",
  ],
  [
    "effect.highlight.brand",
    tokens.effect.highlight.brand,
    "Realce interno curto sobre conteúdo de marca.",
  ],
  [
    "effect.highlight.brandSurface",
    tokens.effect.highlight.brandSurface,
    "Realce interno da superfície de marca.",
  ],
  [
    "effect.highlight.glassControl",
    tokens.effect.highlight.glassControl,
    "Reflexo interno do controle de vidro.",
  ],
] as const;

export const Contrato: Story = {
  render: () => (
    <main className="clv-effects-page">
      <Intro title="Tratamento complementar, nunca informação essencial">
        Effects organiza blur, backdrop blur, glow e highlights aprovados. A interface precisa
        continuar compreensível quando esses tratamentos desaparecem.
      </Intro>

      <section aria-labelledby="effects-contract" className="clv-effects-section">
        <header>
          <h2 id="effects-contract">Oito papéis canônicos</h2>
          <p>Os nomes descrevem intenção e contexto; intensidade visual é consequência.</p>
        </header>
        <ol className="clv-effects-contract">
          {roles.map(([path, value, description]) => (
            <li key={path}>
              <span
                aria-hidden="true"
                className={`clv-effects-swatch clv-effects-swatch--${path.split(".").at(-1)}`}
                style={{ "--clv-effects-sample": value } as CSSProperties}
              />
              <code>{path}</code>
              <p>{description}</p>
              <small>{value}</small>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="effects-aliases" className="clv-effects-aliases">
        <h2 id="effects-aliases">Compatibilidade controlada</h2>
        <p>
          <code>effect.blur.brand</code>, <code>effect.glass.backdropBlur</code> e{" "}
          <code>effect.glass.shadow</code> continuam como aliases. Novos consumidores usam os papéis
          canônicos.
        </p>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("listitem")).toHaveLength(8);
    await expect(canvas.getByText("effect.blur.floatingSurface")).toBeVisible();
  },
};

const boundaries = [
  ["Effects", "Blur, glow e highlights complementam uma composição aprovada."],
  ["Elevation", "Sombra funcional comunica a relação entre planos."],
  ["Focus", "Outline mostra onde está a interação por teclado."],
  ["Motion", "Duração e easing explicam uma mudança de estado."],
  ["Gradiente", "Preenchimento cromático pertence a gradient.* ou ao componente."],
  ["Stacking", "z-index e ordem de pintura permanecem locais à composição."],
] as const;

export const FronteirasEAntiusos: Story = {
  name: "Fronteiras e antiusos",
  render: () => (
    <main className="clv-effects-page">
      <Intro title="Cada decisão continua em sua própria foundation">
        Vidro não transforma uma dock em overlay; glow não indica foco; sombra inset não cria
        hierarquia. Separe o tratamento visual da função que a interface precisa comunicar.
      </Intro>

      <section aria-label="Fronteiras da foundation" className="clv-effects-boundaries">
        {boundaries.map(([title, copy]) => (
          <article key={title}>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section aria-labelledby="effects-antiuse" className="clv-effects-antiuse">
        <header>
          <h2 id="effects-antiuse">Não espalhar efeitos pela operação</h2>
          <p>Os exemplos abaixo são antiusos documentais, não padrões disponíveis.</p>
        </header>
        <div>
          <article>
            <h3>Formulário translúcido</h3>
            <p>O fundo variável reduz previsibilidade de contraste e leitura.</p>
          </article>
          <article>
            <h3>Tabela com blur</h3>
            <p>Filtros grandes e repetidos aumentam custo de composição sem melhorar a tarefa.</p>
          </article>
          <article>
            <h3>Estado comunicado por glow</h3>
            <p>Sucesso, erro, seleção e foco exigem texto, semântica ou indicador próprio.</p>
          </article>
        </div>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("article")).toHaveLength(9);
    await expect(canvas.getByRole("heading", { name: "Focus" })).toBeVisible();
  },
};

export const PilotosEFallbacks: Story = {
  name: "Pilotos e fallbacks",
  render: () => (
    <main className="clv-effects-page">
      <Intro title="Poucos contextos, conteúdo sempre preservado">
        BrandPanel e Button glass são expressivos. StickyActionBar usa Elevation para hierarquia e
        um blur complementar. O cenário sem backdrop-filter mantém superfícies e ações legíveis.
      </Intro>

      <section aria-labelledby="effects-approved" className="clv-effects-section">
        <header>
          <h2 id="effects-approved">Aplicações aprovadas</h2>
          <p>O efeito não altera nome, ordem de leitura, foco ou ação disponível.</p>
        </header>
        <div className="clv-effects-pilots">
          <BrandPanel
            actions={<Button variant="glass">Conhecer a próxima etapa</Button>}
            description="O conteúdo continua completo sem brilho, transparência ou mídia."
            eyebrow="Marco da jornada"
            title="Configuração pronta para revisão"
          />
          <div className="clv-effects-action-preview">
            <Button variant="gradient">Concluir marco</Button>
            <Button variant="glass">Explorar capacidade</Button>
          </div>
          <div className="clv-effects-dock-preview">
            <StickyActionBar
              previousAction={<Button variant="ghost">Anterior</Button>}
              primaryAction={<Button>Continuar</Button>}
              status={<SaveStatus lastSavedAt="10:42" status="saved" />}
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="effects-fallback" className="clv-effects-fallback is-no-backdrop">
        <header>
          <h2 id="effects-fallback">Fallback simulado · sem backdrop-filter</h2>
          <p>
            A classe de QA remove o filtro e força superfícies sólidas. O navegador recebe a mesma
            estratégia por <code>@supports not</code>.
          </p>
        </header>
        <BrandPanel
          actions={<Button variant="glass">Continuar sem efeito</Button>}
          description="Texto, ação e ordem de leitura permanecem disponíveis."
          title="O conteúdo não depende do vidro"
        />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const glass = canvas.getByRole("button", { name: "Explorar capacidade" });
    const fallback = canvas.getByRole("button", { name: "Continuar sem efeito" });
    const panel = canvas.getByRole("region", { name: "Configuração pronta para revisão" });

    await expect(getComputedStyle(glass).backdropFilter).toContain("blur(4px)");
    await expect(getComputedStyle(panel).backdropFilter).toContain("blur(2px)");
    await expect(getComputedStyle(fallback).backdropFilter).toBe("none");
    await expect(getComputedStyle(fallback).backgroundColor).toBe("rgb(2, 24, 38)");
  },
};

export const AcessibilidadeEPerformance: Story = {
  name: "Acessibilidade e performance",
  render: () => (
    <main className="clv-effects-page">
      <Intro title="Resiliência antes de acabamento">
        Valide 200% de zoom, viewport compacto, forced colors e movimento reduzido. Não trate
        inspeção técnica como medição de GPU ou bateria.
      </Intro>

      <section className="clv-effects-checks">
        <article>
          <h2>Legibilidade</h2>
          <p>Texto essencial usa cor sólida e contraste AA no pior fundo aprovado.</p>
        </article>
        <article>
          <h2>Forced colors</h2>
          <p>Blur, glow, transparência e sombras cedem lugar a Canvas e CanvasText.</p>
        </article>
        <article>
          <h2>Reduced motion</h2>
          <p>Effects não anima sozinho; transições associadas obedecem à Motion Foundation.</p>
        </article>
        <article>
          <h2>Composição</h2>
          <p>Evite filtros grandes, múltiplos backdrops e pseudo-elementos empilhados.</p>
        </article>
        <article>
          <h2>Viewport compacto</h2>
          <p>Reduza a decoração e preserve uma coluna sem overflow horizontal.</p>
        </article>
        <article>
          <h2>Desempenho</h2>
          <p>A avaliação atual é inspeção técnica; não há benchmark de dispositivos.</p>
        </article>
      </section>

      <aside className="clv-effects-budget" aria-label="Limite de composição recomendado">
        <strong>Regra operacional</strong>
        <span>
          Uma superfície com backdrop blur por região visível; glow apenas na área de marca.
        </span>
      </aside>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("article")).toHaveLength(6);
    await expect(canvas.getByLabelText("Limite de composição recomendado")).toBeVisible();
  },
};
