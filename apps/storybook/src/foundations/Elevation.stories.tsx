import { BuildingIcon } from "@clavia-ds/icons";
import { tokens } from "@clavia-ds/tokens";
import { Alert, Select, StepCard, Tooltip } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { expect, waitFor, within } from "storybook/test";

import "./elevation.css";

const roles = ["flat", "raised", "lifted", "floating", "overlay"] as const;

const roleCopy = {
  flat: "Sem sombra. A composição depende de superfície, espaçamento ou borda.",
  raised: "Elevação discreta para controles e superfícies contidas.",
  lifted: "Destaque persistente para cards e painéis sem os separar do fluxo.",
  floating: "Conteúdo destacado e não bloqueante, separado do fluxo imediato.",
  overlay: "Conteúdo de alta prioridade sobre um contexto bloqueado; nunca o backdrop.",
} as const;

const meta = {
  parameters: { layout: "fullscreen" },
  title: "Visão geral/Fundamentos/Elevation",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Intro({ children, title }: { children: string; title: string }) {
  return (
    <header className="clv-elevation-page__intro">
      <p className="clv-elevation-page__eyebrow">Foundation · elevation</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </header>
  );
}

export const Contrato: Story = {
  render: () => (
    <main className="clv-elevation-page">
      <Intro title="Profundidade com função, não decoração">
        Cinco papéis semânticos cobrem superfícies planas, elevadas, destacadas, flutuantes e
        sobrepostas. Elevação não altera automaticamente a ordem de empilhamento.
      </Intro>

      <section aria-labelledby="elevation-roles" className="clv-elevation-section">
        <header>
          <h2 id="elevation-roles">Papéis canônicos</h2>
          <p>Escolha pelo papel da superfície; intensidade visual é consequência.</p>
        </header>
        <ol className="clv-elevation-grid">
          {roles.map((name) => (
            <li key={name}>
              <span
                aria-hidden="true"
                className="clv-elevation-sample"
                style={{ "--clv-elevation-sample": tokens.elevation[name] } as CSSProperties}
              />
              <code>elevation.{name}</code>
              <p>{roleCopy[name]}</p>
              <small>{tokens.elevation[name]}</small>
            </li>
          ))}
        </ol>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("listitem")).toHaveLength(5);
    await expect(canvas.getByText("elevation.overlay")).toBeVisible();
  },
};

export const Composicao: Story = {
  name: "Composição e comparação",
  render: () => (
    <main className="clv-elevation-page">
      <Intro title="Antes da sombra, resolva a superfície">
        Contraste de cor, espaçamento e borda separam regiões adjacentes. A sombra entra apenas
        quando a relação espacial precisa ser comunicada.
      </Intro>

      <section aria-labelledby="elevation-comparison" className="clv-elevation-section">
        <header>
          <h2 id="elevation-comparison">Mesmo conteúdo, estratégias diferentes</h2>
          <p>As amostras preservam conteúdo e geometria para tornar a decisão comparável.</p>
        </header>
        <div className="clv-elevation-comparison">
          <article className="clv-elevation-card clv-elevation-card--surface">
            <h3>Superfície</h3>
            <p>Contraste de plano, sem linha ou sombra.</p>
          </article>
          <article className="clv-elevation-card clv-elevation-card--border">
            <h3>Borda</h3>
            <p>Limite explícito entre regiões adjacentes.</p>
          </article>
          <article className="clv-elevation-card clv-elevation-card--raised">
            <h3>Elevação</h3>
            <p>Profundidade discreta para uma superfície destacada.</p>
          </article>
        </div>
      </section>

      <section aria-labelledby="elevation-nested" className="clv-elevation-nested">
        <header>
          <h2 id="elevation-nested">Superfícies aninhadas</h2>
          <p>Um card dentro de outro não sobe de nível por padrão.</p>
        </header>
        <article>
          <h3>Clínica Aurora</h3>
          <div>
            <strong>Horários</strong>
            <span>Separação por espaço e superfície sutil.</span>
          </div>
        </article>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("article")).toHaveLength(4);
    await expect(canvas.getByRole("heading", { name: "Superfícies aninhadas" })).toBeVisible();
  },
};

export const PilotosERegras: Story = {
  name: "Pilotos e regras",
  render: () => (
    <main className="clv-elevation-page">
      <Intro title="A profundidade acompanha o comportamento">
        Alert e StepCard usam raised. Cards e painéis persistentes podem usar lifted; Select e
        Tooltip usam floating. Overlay fica reservado ao conteúdo apresentado sobre um contexto
        bloqueado.
      </Intro>

      <section aria-labelledby="elevation-pilots" className="clv-elevation-pilots">
        <header>
          <h2 id="elevation-pilots">Pilotos funcionais</h2>
          <p>Foco continua sendo comunicado pelo anel de foco, não por uma sombra mais forte.</p>
        </header>
        <div className="clv-elevation-pilots__grid">
          <Alert status="info" title="Raised">
            Mensagem persistente próxima ao conteúdo relacionado.
          </Alert>
          <div className="clv-elevation-select-pilot">
            <Select
              defaultOpen
              label="Atendimento"
              name="elevation-attendance"
              options={[
                { label: "Presencial", value: "presencial" },
                { label: "Remoto", value: "remoto" },
              ]}
            />
          </div>
          <StepCard
            description="Passe o ponteiro ou navegue por teclado para comparar hover e foco."
            leadingIcon={<BuildingIcon />}
            number={1}
            onClick={() => undefined}
            status="available"
            title="Sobre a Clínica"
          />
          <Tooltip content="Conteúdo flutuante e não bloqueante" triggerLabel="Sobre elevation">
            <span aria-hidden="true">?</span>
          </Tooltip>
        </div>
      </section>

      <section className="clv-elevation-rules">
        <article className="clv-elevation-rules__usage">
          <h2>Como escolher</h2>
          <ol>
            <li>
              Comece com superfície, espaço ou borda; use sombra somente para comunicar relação
              espacial.
            </li>
            <li>Use raised em controles e superfícies contidas.</li>
            <li>
              Use lifted em cards e painéis persistentes que precisam de destaque, mas continuam no
              fluxo.
            </li>
            <li>
              Use floating em conteúdo temporário ou ancorado que se separa do fluxo sem bloquear o
              contexto.
            </li>
            <li>Use overlay apenas no conteúdo acima de um backdrop bloqueante.</li>
          </ol>
        </article>
        <article>
          <h2>Elevation × stacking</h2>
          <p>Shadow comunica profundidade; z-index resolve a ordem de pintura.</p>
        </article>
        <article>
          <h2>Elevation × focus</h2>
          <p>Foco precisa permanecer visível mesmo quando sombras desaparecem.</p>
        </article>
        <article>
          <h2>Elevation × effects</h2>
          <p>Glow, vidro, highlights e sombras internas continuam expressivos ou locais.</p>
        </article>
        <article>
          <h2>Clipping</h2>
          <p>Não aplique overflow hidden no ancestral que precisa mostrar uma sombra externa.</p>
        </article>
        <article>
          <h2>Sem escalada automática</h2>
          <p>
            Hover, foco e superfícies aninhadas não avançam para lifted por padrão; cada componente
            declara sua relação espacial.
          </p>
        </article>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole("button", { name: /Sobre a Clínica/ });
    await expect(
      getComputedStyle(card).getPropertyValue("--clv-step-card-interactive-shadow").trim(),
    ).not.toBe("");
    await expect(
      getComputedStyle(document.documentElement).getPropertyValue("--clv-focus-ring").trim(),
    ).not.toBe("");
    await waitFor(() => expect(within(document.body).getByRole("listbox")).toBeVisible());
    await expect(canvas.getByRole("button", { name: "Sobre elevation" })).toBeVisible();
  },
};
