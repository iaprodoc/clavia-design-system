import { tokens } from "@clavia-ds/tokens";
import { Button, Checkbox, Input, RadioGroup, Select, Slider, Switch, Tabs } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import "./focus.css";

const meta = {
  parameters: { layout: "fullscreen" },
  title: "Visão geral/Fundamentos/Focus",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Intro({ children, title }: { children: string; title: string }) {
  return (
    <header className="clv-focus-page__intro">
      <p className="clv-focus-page__eyebrow">Foundation · focus</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </header>
  );
}

const anatomy = [
  ["Cor", "color.focus.outline", tokens.color.focus.outline],
  ["Espessura", "focus.width → border.width.thick", tokens.focus.width],
  ["Estilo", "focus.style → border.style.solid", tokens.focus.style],
  ["Afastamento", "focus.offset → space.0_5", tokens.focus.offset],
] as const;

export const Contrato: Story = {
  render: () => (
    <main className="clv-focus-page">
      <Intro title="Foco visível, previsível e contínuo">
        Focus define o indicador de navegação por teclado. Cor pertence a Color; espessura e estilo
        pertencem a Border; distância pertence a Spacing; cantos acompanham Radius; a resposta é
        instantânea, como definido por Motion.
      </Intro>

      <section aria-labelledby="focus-anatomy" className="clv-focus-section">
        <header>
          <h2 id="focus-anatomy">Anatomia e rastreabilidade</h2>
          <p>O contrato é pequeno, sem aliases específicos de produto.</p>
        </header>
        <ol className="clv-focus-anatomy">
          {anatomy.map(([label, path, value]) => (
            <li key={path}>
              <span className="clv-focus-anatomy__sample" aria-hidden="true" />
              <strong>{label}</strong>
              <code>{path}</code>
              <small>{value}</small>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="focus-states" className="clv-focus-section">
        <header>
          <h2 id="focus-states">Foco não é hover, press ou seleção</h2>
          <p>As amostras congelam estados para comparação. Use Tab para observar o foco real.</p>
        </header>
        <div className="clv-focus-states">
          <button type="button">Padrão</button>
          <button type="button" data-demo-state="hover">
            Hover
          </button>
          <button type="button" data-demo-state="active">
            Press
          </button>
          <button type="button" aria-pressed="true">
            Selecionado
          </button>
          <button type="button" data-demo-state="focus-visible">
            Focus visible
          </button>
        </div>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstButton = canvas.getByRole("button", { name: "Padrão" });
    await userEvent.tab();
    await expect(firstButton).toHaveFocus();
    await expect(getComputedStyle(firstButton).outlineWidth).toBe("2px");
    await expect(getComputedStyle(firstButton).outlineOffset).toBe("2px");
  },
};

export const SuperficiesEControles: Story = {
  name: "Superfícies e controles",
  render: () => (
    <main className="clv-focus-page">
      <Intro title="O mesmo indicador atravessa controles e superfícies">
        Navegue com Tab e Shift+Tab. A ordem acompanha a leitura, controles desabilitados são
        ignorados e nenhuma mudança de densidade altera a geometria do foco.
      </Intro>

      <section aria-label="Superfícies" className="clv-focus-surfaces">
        <article>
          <h2>Canvas</h2>
          <Button variant="secondary">Revisar agenda</Button>
          <Button disabled variant="secondary">
            Indisponível
          </Button>
        </article>
        <article className="is-subtle">
          <h2>Subtle</h2>
          <Input aria-label="Nome da clínica" placeholder="Nome da clínica" />
        </article>
        <article className="is-raised">
          <h2>Raised</h2>
          <Checkbox label="Enviar confirmação" />
        </article>
        <article className="is-inverse">
          <h2>Inverse</h2>
          <Button tone="on-dark" variant="adaptive-glass">
            Salvar alterações
          </Button>
        </article>
      </section>

      <section aria-labelledby="focus-controls" className="clv-focus-section clv-focus-controls">
        <header>
          <h2 id="focus-controls">Pilotos interativos</h2>
          <p>Estados nativos e React Aria recebem o mesmo contrato visual.</p>
        </header>
        <div className="clv-focus-controls__grid">
          <Switch label="Lembrar paciente" />
          <RadioGroup
            defaultValue="online"
            label="Atendimento"
            name="focus-attendance"
            options={[
              { label: "Online", value: "online" },
              { label: "Presencial", value: "presencial" },
            ]}
          />
          <Select
            label="Unidade"
            name="focus-unit"
            options={[
              { label: "Centro", value: "centro" },
              { label: "Aldeota", value: "aldeota" },
            ]}
          />
          <Slider defaultValue={30} label="Duração" maxValue={60} minValue={15} />
        </div>
        <Tabs
          label="Dados da clínica"
          tabs={[
            { content: "Dados gerais.", id: "geral", label: "Geral" },
            { content: "Regras da agenda.", id: "agenda", label: "Agenda" },
          ]}
          variant="secondary"
        />
      </section>

      <section className="clv-focus-density" data-clv-density="compact">
        <h2>Visão compacta</h2>
        <p>Density reduz espaços de composição; width e offset continuam em 2 px.</p>
        <Button variant="secondary">Ação compacta</Button>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const review = canvas.getByRole("button", { name: "Revisar agenda" });
    await userEvent.tab();
    await expect(review).toHaveFocus();
    await expect(getComputedStyle(review).outlineStyle).toBe("solid");
    await userEvent.tab();
    await expect(canvas.getByRole("textbox", { name: "Nome da clínica" })).toHaveFocus();
  },
};

export const LimitesEAcessibilidade: Story = {
  name: "Limites e acessibilidade",
  render: () => (
    <main className="clv-focus-page">
      <Intro title="O indicador precisa sobreviver ao layout">
        Valide teclado, zoom de 200%, forced colors e recortes de overflow. Reduced motion não deve
        atrasar nem remover o foco, porque o indicador entra instantaneamente.
      </Intro>

      <section className="clv-focus-limits">
        <article>
          <h2>Correto · espaço para o outline</h2>
          <div className="clv-focus-overflow is-safe">
            <Button variant="secondary">Foco preservado</Button>
          </div>
        </article>
        <article>
          <h2>Antiuso · overflow corta o indicador</h2>
          <div className="clv-focus-overflow is-clipped">
            <button type="button">Não reproduzir</button>
          </div>
          <p>Quando o recorte for inevitável, use a adaptação inset documentada para Table.</p>
        </article>
        <article>
          <h2>Cantos e tamanhos</h2>
          <div className="clv-focus-radius-row">
            <button type="button" className="is-xs">
              XS
            </button>
            <button type="button" className="is-md">
              MD
            </button>
            <button type="button" className="is-pill">
              Pill
            </button>
          </div>
        </article>
        <article>
          <h2>Modos de contraste</h2>
          <p>Em forced colors, Highlight substitui a cor da marca e sombras são dispensadas.</p>
          <p>
            Em superfícies escuras, o indicador usa o foreground inverso já pertencente a Color.
          </p>
        </article>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const safe = canvas.getByRole("button", { name: "Foco preservado" });
    safe.focus();
    await expect(safe).toHaveFocus();
    await expect(getComputedStyle(safe).outlineColor).toBe("rgb(34, 78, 130)");
  },
};
