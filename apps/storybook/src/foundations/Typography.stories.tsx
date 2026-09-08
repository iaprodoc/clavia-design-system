import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import "./typography.css";

type TypographyArgs = {
  shortText: string;
  longText: string;
};

type RoleSpec = {
  className: string;
  name: string;
  token: string;
  use: string;
  context: "Compartilhado" | "Jornada guiada" | "Operação densa";
};

const roles: ReadonlyArray<RoleSpec> = [
  {
    className: "clv-type-heading-page",
    name: "Heading/Page",
    token: "typography.heading.page",
    use: "Título único da página; 24px em compacto e 32px a partir de 48rem.",
    context: "Compartilhado",
  },
  {
    className: "clv-type-heading-section",
    name: "Heading/Section",
    token: "typography.heading.section",
    use: "Abre uma seção principal sem competir com o título da página.",
    context: "Compartilhado",
  },
  {
    className: "clv-type-heading-component",
    name: "Heading/Component",
    token: "typography.heading.component",
    use: "Título de card, painel, modal ou bloco autocontido.",
    context: "Compartilhado",
  },
  {
    className: "clv-type-body",
    name: "Body/Default",
    token: "typography.body.default",
    use: "Conteúdo principal e instruções curtas.",
    context: "Compartilhado",
  },
  {
    className: "clv-type-body-supporting",
    name: "Body/Supporting",
    token: "typography.body.supporting",
    use: "Explicação auxiliar, descrição de campo e conteúdo mais denso.",
    context: "Compartilhado",
  },
  {
    className: "clv-type-body-long",
    name: "Body/Long",
    token: "typography.body.long",
    use: "Leitura contínua, com entrelinha 1.6 e largura máxima de 70 caracteres.",
    context: "Jornada guiada",
  },
  {
    className: "clv-type-label",
    name: "Label/Default",
    token: "typography.label.default",
    use: "Campos, controles e ações; o peso comunica função, não hierarquia.",
    context: "Compartilhado",
  },
  {
    className: "clv-type-label-compact",
    name: "Label/Compact",
    token: "typography.label.compact",
    use: "Cabeçalhos e controles densos, sem descer de 12px.",
    context: "Operação densa",
  },
  {
    className: "clv-type-caption",
    name: "Caption",
    token: "typography.caption",
    use: "Metadado e anotação; nunca substitui conteúdo principal.",
    context: "Compartilhado",
  },
  {
    className: "clv-type-data",
    name: "Data",
    token: "typography.data",
    use: "Valores comparáveis em tabelas e métricas, com numerais tabulares.",
    context: "Operação densa",
  },
  {
    className: "clv-type-code",
    name: "Code",
    token: "typography.code",
    use: "Identificadores, comandos e conteúdo técnico; não é fonte estrutural.",
    context: "Operação densa",
  },
];

const meta: Meta<TypographyArgs> = {
  args: {
    shortText: "Clareza para cada decisão clínica.",
    longText:
      "A tipografia organiza a jornada sem disputar atenção com a tarefa. Em textos mais longos, a entrelinha e o comprimento da linha preservam o ritmo de leitura, inclusive quando o conteúdo cresce ou a pessoa amplia a interface.",
  },
  argTypes: {
    shortText: { control: "text", name: "Texto curto" },
    longText: { control: "text", name: "Texto longo" },
  },
  parameters: {
    layout: "fullscreen",
  },
  title: "Visão geral/Fundamentos/Tipografia",
};

export default meta;

type Story = StoryObj<TypographyArgs>;

function Intro({ description, title }: { description: string; title: string }) {
  return (
    <header className="clv-type-page__intro">
      <p className="clv-type-page__eyebrow">Foundation · tipografia</p>
      <h1 className="clv-type-heading-page">{title}</h1>
      <p className="clv-type-body-long">{description}</p>
    </header>
  );
}

export const ContratoSemantico: Story = {
  name: "Contrato semântico",
  parameters: {
    docs: {
      description: {
        story:
          "API tipográfica pública da Clavia. Produtos escolhem um papel pelo propósito do conteúdo; tamanhos, pesos e entrelinhas primitivos ficam reservados para evolução do tema e diagnóstico.",
      },
    },
  },
  render: ({ longText, shortText }: TypographyArgs) => (
    <main className="clv-type-page">
      <Intro
        description="Uma família funcional, onze papéis e uma única adaptação responsiva. O contrato atende jornadas guiadas, leitura e interfaces operacionais densas pela escolha do papel."
        title="Hierarquia com intenção"
      />

      <section aria-labelledby="roles-title" className="clv-type-section">
        <header className="clv-type-section__header">
          <h2 className="clv-type-heading-component" id="roles-title">
            Papéis publicados
          </h2>
        </header>
        <ol className="clv-type-role-list">
          {roles.map((role) => (
            <li className="clv-type-role" data-testid={role.token} key={role.token}>
              <div className="clv-type-role__identity">
                <code className="clv-type-code">{role.name}</code>
                <span className="clv-type-caption">{role.context}</span>
              </div>
              <p className={role.className}>{role.name === "Body/Long" ? longText : shortText}</p>
              <div className="clv-type-role__meta">
                <code>{role.token}</code>
                <p>{role.use}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="rules-title" className="clv-type-guidance">
        <h2 className="clv-type-heading-component" id="rules-title">
          Regra de decisão
        </h2>
        <div className="clv-type-guidance__grid">
          <article className="clv-type-guidance__do">
            <h3 className="clv-type-label">Use</h3>
            <p className="clv-type-body-supporting">
              Escolha Heading, Body, Label, Caption, Data ou Code pelo trabalho que o texto faz. Na
              Sora, use 400 para leitura e 500 como ênfase padrão em títulos, rótulos e ações.
            </p>
          </article>
          <article className="clv-type-guidance__dont">
            <h3 className="clv-type-label">Evite</h3>
            <p className="clv-type-body-supporting">
              Não use 600 como padrão nem introduza 700 na interface funcional. Resolva a hierarquia
              primeiro com tamanho, cor e espaçamento; reserve 600 para uma ênfase local que
              realmente precise superar 500.
            </p>
          </article>
        </div>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = canvas.getByTestId("typography.body.default").querySelector("p");
    const data = canvas.getByTestId("typography.data").querySelector("p");
    const heading = canvas.getByTestId("typography.heading.page").querySelector("p");
    const code = canvas.getByTestId("typography.code").querySelector("p");

    if (!body || !data || !heading || !code) {
      throw new Error("Amostra semântica não encontrada.");
    }

    await expect(canvas.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(getComputedStyle(body).fontSize).toBe("16px");
    await expect(getComputedStyle(body).lineHeight).toBe("24px");
    await expect(getComputedStyle(heading).fontWeight).toBe("500");
    await expect(getComputedStyle(data).fontVariantNumeric).toContain("tabular-nums");
    await expect(getComputedStyle(code).fontFamily).toContain("SFMono-Regular");
  },
};

export const ContextosDeProduto: Story = {
  name: "Contextos de uso",
  render: () => (
    <main className="clv-type-page">
      <Intro
        description="Os exemplos usam os mesmos tokens semânticos. Uma jornada guiada favorece orientação e respiro; uma interface operacional seleciona papéis compactos e numerais tabulares para leitura rápida."
        title="Uma arquitetura, duas densidades"
      />
      <div className="clv-type-contexts">
        <article className="clv-type-mobile" aria-label="Exemplo em viewport compacto">
          <header>
            <p className="clv-type-caption">Etapa 2 de 4</p>
            <h2 className="clv-type-heading-page">Dados da clínica</h2>
            <p className="clv-type-body">
              Revise as informações antes de avançar. Você poderá alterá-las depois.
            </p>
          </header>
          <label className="clv-type-label" htmlFor="clinic-name">
            Nome da clínica
          </label>
          <input id="clinic-name" readOnly value="Clínica Horizonte" />
          <p className="clv-type-caption">Use o nome exibido nos documentos oficiais.</p>
          <button type="button">Continuar</button>
        </article>

        <article className="clv-type-hub" aria-label="Exemplo de operação densa">
          <header>
            <div>
              <p className="clv-type-caption">Visão operacional</p>
              <h2 className="clv-type-heading-section">Atendimentos</h2>
            </div>
            <p className="clv-type-data">128 registros</p>
          </header>
          <section
            aria-label="Tabela de atendimentos com rolagem horizontal"
            className="clv-type-table-scroll"
          >
            <table className="clv-type-table" aria-label="Atendimentos recentes">
              <thead>
                <tr className="clv-type-table__row clv-type-table__head">
                  <th className="clv-type-label-compact" scope="col">
                    Paciente
                  </th>
                  <th className="clv-type-label-compact" scope="col">
                    Horário
                  </th>
                  <th className="clv-type-label-compact" scope="col">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Marina Alves", "08:30", "Confirmado"],
                  ["João Nogueira", "09:15", "Em espera"],
                  ["Lia Mendonça", "10:00", "Confirmado"],
                ].map(([patient, time, status]) => (
                  <tr className="clv-type-table__row" key={patient}>
                    <td className="clv-type-body-supporting">{patient}</td>
                    <td className="clv-type-data">{time}</td>
                    <td className="clv-type-caption">{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </article>
      </div>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Exemplo em viewport compacto")).toBeVisible();
    await expect(canvas.getByRole("table", { name: "Atendimentos recentes" })).toBeVisible();
    await expect(canvas.getByDisplayValue("Clínica Horizonte")).toBeVisible();
  },
};

export const AmpliacaoETextSpacing: Story = {
  name: "Ampliação e text spacing",
  render: ({ longText }: TypographyArgs) => (
    <main className="clv-type-page">
      <Intro
        description="Dois cenários de estresse verificam crescimento, refluxo e espaçamento customizado sem ocultar conteúdo nem depender de altura fixa."
        title="Leitura que suporta adaptação"
      />
      <div className="clv-type-a11y-grid">
        <article className="clv-type-a11y-card clv-type-a11y-card--zoom" data-testid="zoom-card">
          <p className="clv-type-caption">Simulação de texto a 200%</p>
          <h2 className="clv-type-heading-component">Confirme os dados</h2>
          <p className="clv-type-body">{longText}</p>
          <button type="button">Revisar informações</button>
        </article>
        <article
          className="clv-type-a11y-card clv-type-a11y-card--spacing"
          data-testid="spacing-card"
        >
          <p className="clv-type-caption">Override WCAG de text spacing</p>
          <h2 className="clv-type-heading-component">Conteúdo preservado</h2>
          <p className="clv-type-body-long">{longText}</p>
          <a href="#roles-title">Voltar aos papéis</a>
        </article>
      </div>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const zoomCard = canvas.getByTestId("zoom-card");
    const spacingCard = canvas.getByTestId("spacing-card");

    await expect(zoomCard.scrollWidth).toBeLessThanOrEqual(zoomCard.clientWidth);
    await expect(spacingCard.scrollWidth).toBeLessThanOrEqual(spacingCard.clientWidth);
    await expect(canvas.getByRole("button", { name: "Revisar informações" })).toBeVisible();
  },
};

export const CamadasDoToken: Story = {
  name: "Primitivo → semântico → componente",
  render: () => (
    <main className="clv-type-page">
      <Intro
        description="A escala guarda valores disponíveis; o papel combina os valores por intenção; o componente aponta para o papel. Produtos consomem o papel ou o componente, nunca remontam a combinação."
        title="Rastreabilidade sem acoplamento"
      />
      <ol className="clv-type-flow" aria-label="Relação entre camadas tipográficas">
        <li>
          <span>1 · Primitivo</span>
          <code>font.size.sm = 0.875rem</code>
          <p>Valor disponível; não decide uso.</p>
        </li>
        <li aria-hidden="true">→</li>
        <li>
          <span>2 · Semântico</span>
          <code>typography.label.default</code>
          <p>Combinação escolhida para rótulos e ações.</p>
        </li>
        <li aria-hidden="true">→</li>
        <li>
          <span>3 · Componente</span>
          <code>component.button.fontWeight</code>
          <p>Alias interno; pode evoluir sem novo valor solto.</p>
        </li>
      </ol>
    </main>
  ),
};

export const TextoComGradiente: Story = {
  name: "Texto com gradiente",
  parameters: {
    docs: {
      description: {
        story:
          "Use o gradiente somente em títulos de destaque. A versão padrão foi desenhada para superfícies claras; a variante inverse preserva a intenção em superfícies escuras. Descrições, formulários, status e conteúdo operacional permanecem em cor sólida.",
      },
    },
  },
  render: () => (
    <main className="clv-story-page">
      <header className="clv-story-page__intro">
        <p>Fundamento tipográfico</p>
        <h1 className="clv-text-gradient clv-text-gradient--on-light">
          Clareza para cada etapa da clínica.
        </h1>
        <p>O efeito preserva a semântica do elemento e deve ser aplicado ao título inteiro.</p>
      </header>
      <section aria-label="Aplicações do gradiente tipográfico" className="clv-story-gradient-grid">
        <article className="clv-story-gradient-panel">
          <p>Sobre superfície clara</p>
          <h2 className="clv-text-gradient clv-text-gradient--on-light">
            Inteligência que orienta decisões.
          </h2>
          <p className="clv-story-gradient-panel__description">
            Mantenha a descrição em cor sólida para preservar a hierarquia.
          </p>
        </article>
        <article className="clv-story-gradient-panel clv-story-gradient-panel--inverse">
          <p>Sobre superfície escura</p>
          <h2 className="clv-text-gradient clv-text-gradient--on-dark">
            Finalize o onboarding com segurança.
          </h2>
          <p className="clv-story-gradient-panel__description">
            A configuração está pronta para avançar.
          </p>
        </article>
      </section>
    </main>
  ),
};
