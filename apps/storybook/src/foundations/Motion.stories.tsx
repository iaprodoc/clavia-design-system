import { InfoIcon, RefreshIcon } from "@clavia-ds/icons";
import { tokens } from "@clavia-ds/tokens";
import { Button, Progress, SaveStatus, Skeleton, StepCard, Tooltip } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import "./motion.css";

const durations = ["instant", "fast", "moderate", "slow"] as const;
const easingNames = ["standard", "decelerate", "accelerate", "linear"] as const;

const meta = {
  parameters: { layout: "fullscreen" },
  title: "Visão geral/Fundamentos/Motion",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Intro({ children, title }: { children: string; title: string }) {
  return (
    <header className="clv-motion-page__intro">
      <p className="clv-motion-page__eyebrow">Foundation · motion</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </header>
  );
}

export const Contrato: Story = {
  render: () => (
    <main className="clv-motion-page">
      <Intro title="Movimento explica mudança">
        Motion define duração, easing e comportamento. Posição pertence a Layout, profundidade a
        Elevation, foco a Focus e efeitos expressivos continuam fora deste contrato funcional.
      </Intro>

      <section aria-labelledby="motion-duration" className="clv-motion-section">
        <header>
          <h2 id="motion-duration">Durações primitivas</h2>
          <p>A escala curta sustenta feedback, mudança de estado, entrada, saída e progresso.</p>
        </header>
        <ol className="clv-motion-grid clv-motion-grid--duration">
          {durations.map((name) => (
            <li key={name}>
              <span aria-hidden="true" className={`clv-motion-duration-sample is-${name}`} />
              <code>motion.duration.{name}</code>
              <strong>{tokens.motion.duration[name]}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="motion-easing" className="clv-motion-section">
        <header>
          <h2 id="motion-easing">Easings</h2>
          <p>
            Standard governa estados; decelerate recebe; accelerate despede; linear mantém ciclos.
          </p>
        </header>
        <ol className="clv-motion-grid clv-motion-grid--easing">
          {easingNames.map((name) => (
            <li key={name}>
              <span aria-hidden="true" className={`clv-motion-easing-sample is-${name}`} />
              <code>motion.easings.{name}</code>
              <small>{tokens.motion.easings[name]}</small>
            </li>
          ))}
        </ol>
      </section>

      <section className="clv-motion-role-grid">
        <article>
          <h2>Feedback · 120 ms</h2>
          <p>Resposta imediata a hover, press, seleção e controles locais.</p>
        </article>
        <article>
          <h2>Estado · 180 ms</h2>
          <p>Substituição ou atualização neutra sem deslocamento estrutural.</p>
        </article>
        <article>
          <h2>Entrada · 240 ms</h2>
          <p>Conteúdo chega com decelerate e se acomoda no estado final.</p>
        </article>
        <article>
          <h2>Saída · 180 ms</h2>
          <p>Conteúdo deixa o contexto com accelerate, sem atrasar a próxima ação.</p>
        </article>
        <article>
          <h2>Progresso · 240 ms</h2>
          <p>Valores determinados preservam continuidade sem simular espera.</p>
        </article>
        <article>
          <h2>Ciclos próprios</h2>
          <p>Loading, skeleton e ambiente ficam fora da escala de transições discretas.</p>
        </article>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("listitem")).toHaveLength(8);
    await expect(canvas.getByText("motion.duration.slow")).toBeVisible();
    await expect(canvas.getByText("motion.easings.accelerate")).toBeVisible();
  },
};

function InteractivePatterns() {
  const [progress, setProgress] = useState(36);
  const [reduced, setReduced] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  return (
    <main className="clv-motion-page" data-motion-reduced={reduced || undefined}>
      <Intro title="Compare o comportamento, não só os valores">
        Reproduza entradas, altere progresso e simule o fallback reduzido. Foco e semântica entram
        imediatamente, independentemente da duração visual.
      </Intro>

      <div className="clv-motion-controls">
        <Button
          leadingIcon={<RefreshIcon aria-hidden="true" />}
          onClick={() => setReplayKey((value) => value + 1)}
          size="sm"
          variant="secondary"
        >
          Reproduzir entradas
        </Button>
        <Button
          onClick={() => setProgress((value) => (value >= 76 ? 36 : value + 20))}
          size="sm"
          variant="secondary"
        >
          Avançar progresso
        </Button>
        <Button onClick={() => setReduced((value) => !value)} size="sm" variant="secondary">
          {reduced ? "Usar movimento padrão" : "Simular movimento reduzido"}
        </Button>
      </div>

      <section aria-label="Padrões interativos" className="clv-motion-pilot-grid" key={replayKey}>
        <article className="clv-motion-enter-demo">
          <h2>Entrada de conteúdo</h2>
          <p>Opacity e deslocamento curto preservam contexto sem alterar o layout.</p>
        </article>
        <article>
          <h2>Overlay flutuante</h2>
          <Tooltip
            defaultOpen
            content="A sombra é floating; a entrada pertence a Motion."
            placement="bottom"
            triggerLabel="Sobre o overlay flutuante"
          >
            <InfoIcon aria-hidden="true" />
          </Tooltip>
        </article>
        <article>
          <h2>Progresso determinado</h2>
          <Progress label="Configuração da clínica" value={progress} />
        </article>
        <StepCard
          description="Hover pode transicionar para raised; foco continua imediato."
          leadingIcon={<InfoIcon aria-hidden="true" />}
          number={2}
          onClick={() => undefined}
          status="available"
          title="Relação com Elevation"
        />
      </section>
    </main>
  );
}

export const PadroesInterativos: Story = {
  name: "Padrões interativos",
  render: () => <InteractivePatterns />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const reducedButton = canvas.getByRole("button", { name: "Simular movimento reduzido" });
    await userEvent.click(reducedButton);
    await expect(canvasElement.querySelector("[data-motion-reduced]")).not.toBeNull();
    const standardButton = canvas.getByRole("button", { name: "Usar movimento padrão" });
    await expect(standardButton).toBeVisible();
    await userEvent.click(standardButton);
    await expect(canvasElement.querySelector("[data-motion-reduced]")).toBeNull();
  },
};

function ContinuousPatterns() {
  const [paused, setPaused] = useState(false);

  return (
    <main className="clv-motion-page">
      <Intro title="Movimento contínuo precisa de limite">
        Loading existe enquanto há trabalho em andamento. Skeleton reserva espaço e pode ser
        pausado. Confirmação e erro permanecem estáticos.
      </Intro>

      <div className="clv-motion-controls">
        <Button onClick={() => setPaused((value) => !value)} size="sm" variant="secondary">
          {paused ? "Retomar demonstração" : "Pausar demonstração"}
        </Button>
      </div>

      <section
        aria-label="Ciclos e estados estáticos"
        className="clv-motion-cycle-grid"
        data-paused={paused || undefined}
      >
        <article>
          <h2>Loading · 800 ms</h2>
          <Button isLoading>Carregando agenda</Button>
        </article>
        <article>
          <h2>Skeleton · 1600 / 1800 ms</h2>
          <Skeleton data-paused={paused || undefined} height={72} label="Carregando resumo" />
        </article>
        <article>
          <h2>Salvando</h2>
          <SaveStatus status="saving" />
        </article>
        <article>
          <h2>Estados concluídos</h2>
          <SaveStatus lastSavedAt="10:42" status="saved" />
          <SaveStatus status="error" />
        </article>
      </section>

      <section className="clv-motion-rule-grid">
        <article>
          <h2>Reduced motion</h2>
          <p>Remove ciclos, escala e deslocamento; texto e estado semântico permanecem.</p>
        </article>
        <article>
          <h2>Performance</h2>
          <p>Prefira opacity e transform. Width fica restrita a progresso determinado.</p>
        </article>
        <article>
          <h2>Antiuso</h2>
          <p>Não anime layout, foco, filtros ou sombras pesadas para decorar uma mudança.</p>
        </article>
        <article>
          <h2>Exceções</h2>
          <p>Marca e ambiente exigem contexto isolado, pausa e revisão própria de Effects.</p>
        </article>
      </section>
    </main>
  );
}

export const CiclosEAcessibilidade: Story = {
  name: "Ciclos e acessibilidade",
  render: () => <ContinuousPatterns />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pause = canvas.getByRole("button", { name: "Pausar demonstração" });
    await userEvent.click(pause);
    await expect(canvasElement.querySelector('[data-paused="true"]')).not.toBeNull();
    await expect(canvas.getByText("Alterações salvas às 10:42")).toBeVisible();
    await expect(canvas.getByText("Não foi possível salvar")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Retomar demonstração" }));
    await expect(canvasElement.querySelector('[data-paused="true"]')).toBeNull();
  },
};
