import { tokens } from "@clavia-ds/tokens";
import { Alert, Button, Field, Input, StatusBadge, Table } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { expect, within } from "storybook/test";

import "./spacing.css";

const primitiveOrder = [
  "0",
  "0_5",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "8",
  "10",
  "12",
  "16",
  "20",
  "24",
] as const;

const semanticFamilies = [
  {
    description: "Distância vertical entre elementos irmãos.",
    name: "Flow / Stack",
    prefix: "--clv-spacing-flow-stack",
    roles: ["2xs", "xs", "sm", "md", "lg", "xl"],
  },
  {
    description: "Distância horizontal entre conteúdo relacionado.",
    name: "Flow / Inline",
    prefix: "--clv-spacing-flow-inline",
    roles: ["2xs", "xs", "sm", "md", "lg"],
  },
  {
    description: "Respiro interno de superfícies e controles.",
    name: "Inset",
    prefix: "--clv-spacing-inset",
    roles: ["2xs", "xs", "sm", "md", "lg"],
  },
  {
    description: "Separação de listas, grades e grupos repetidos.",
    name: "Grid",
    prefix: "--clv-spacing-grid",
    roles: ["sm", "md", "lg"],
  },
] as const;

const clinics = [
  { city: "Fortaleza, CE", id: "aurora", name: "Clínica Aurora", status: "Ativa" },
  { city: "Recife, PE", id: "horizonte", name: "Clínica Horizonte", status: "Em implantação" },
] as const;

const meta = {
  parameters: {
    layout: "fullscreen",
  },
  title: "Visão geral/Fundamentos/Spacing",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function Intro({ children, title }: { children: string; title: string }) {
  return (
    <header className="clv-spacing-page__intro">
      <p className="clv-spacing-page__eyebrow">Foundation · spacing</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </header>
  );
}

function DensityLabel({ children }: { children: string }) {
  return <span className="clv-spacing-density-label">{children}</span>;
}

function ClinicTable() {
  return (
    <Table variant="plain">
      <Table.ScrollContainer>
        <Table.Content label="Clínicas em implantação" minWidth="32rem">
          <Table.Header>
            <Table.Column id="clinic" isRowHeader>
              Clínica
            </Table.Column>
            <Table.Column id="city">Cidade</Table.Column>
            <Table.Column id="status">Status</Table.Column>
          </Table.Header>
          <Table.Body>
            {clinics.map((clinic) => (
              <Table.Row id={clinic.id} key={clinic.id}>
                <Table.Cell>{clinic.name}</Table.Cell>
                <Table.Cell>{clinic.city}</Table.Cell>
                <Table.Cell>
                  <StatusBadge status={clinic.status === "Ativa" ? "success" : "info"}>
                    {clinic.status}
                  </StatusBadge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

export const ContratoSemantico: Story = {
  name: "Contrato semântico",
  parameters: {
    docs: {
      description: {
        story:
          "A escala primitiva existe para compor os papéis. Componentes e produtos escolhem flow, inset, grid, section ou gutter pela relação que precisam expressar.",
      },
    },
  },
  render: () => (
    <main className="clv-spacing-page">
      <Intro title="Distâncias com função">
        A fundação preserva a escala já distribuída e acrescenta apenas zero, um passo micro e três
        valores para seções. Os papéis semânticos mantêm jornadas guiadas e operações densas no
        mesmo contrato.
      </Intro>

      <section aria-labelledby="primitive-title" className="clv-spacing-section">
        <header className="clv-spacing-section__header">
          <h2 id="primitive-title">Escala primitiva</h2>
          <p>O passo de 2 px fica restrito a geometria e ajustes ópticos documentados.</p>
        </header>
        <ol className="clv-spacing-primitives">
          {primitiveOrder.map((name) => {
            const value = tokens.space[name];
            return (
              <li key={name}>
                <code>space.{name}</code>
                <span
                  aria-hidden="true"
                  className="clv-spacing-primitive__bar"
                  style={{ "--clv-spacing-sample-size": value } as CSSProperties}
                />
                <span>{Number.parseFloat(value) * 16}px</span>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="families-title" className="clv-spacing-section">
        <header className="clv-spacing-section__header">
          <h2 id="families-title">Famílias responsivas à densidade</h2>
          <p>Os mesmos nomes resolvem para valores menores dentro de um escopo compacto.</p>
        </header>
        <div className="clv-spacing-families">
          {semanticFamilies.map((family) => (
            <article className="clv-spacing-family" key={family.name}>
              <header>
                <h3>{family.name}</h3>
                <p>{family.description}</p>
              </header>
              <ul>
                {family.roles.map((role) => (
                  <li key={role}>
                    <code>{role}</code>
                    <span
                      aria-hidden="true"
                      className="clv-spacing-family__sample"
                      style={
                        {
                          "--clv-spacing-sample-gap": `var(${family.prefix}-${role})`,
                        } as CSSProperties
                      }
                    >
                      <i />
                      <i />
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="invariants-title" className="clv-spacing-section">
        <header className="clv-spacing-section__header">
          <h2 id="invariants-title">Invariantes de layout</h2>
          <p>Section e gutter não encolhem quando uma superfície operacional fica compacta.</p>
        </header>
        <div className="clv-spacing-invariants">
          <code>section: 32 · 48 · 64 · 80 px</code>
          <code>gutter: 16 · 24 · 32 px</code>
        </div>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const primitives = canvasElement.querySelectorAll(".clv-spacing-primitives li");

    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Distâncias com função",
    );
    await expect(primitives.length).toBeGreaterThanOrEqual(14);
    await expect(canvas.getByText("section: 32 · 48 · 64 · 80 px")).toBeVisible();
  },
};

export const ContextosDeDensidade: Story = {
  name: "Contextos de densidade",
  parameters: {
    docs: {
      description: {
        story:
          "Default atende contextos de leitura e jornada guiada. Compact é opt-in para superfícies densas e não altera altura de controles, section ou gutter.",
      },
    },
  },
  render: () => (
    <main className="clv-spacing-page">
      <Intro title="Uma base, dois ritmos">
        Density ajusta relações internas autorizadas. Tamanho de controle e área interativa
        continuam regidos pelos contratos dos componentes.
      </Intro>

      <div className="clv-spacing-contexts">
        <section className="clv-spacing-context" data-testid="default-context">
          <DensityLabel>Default · jornada guiada</DensityLabel>
          <div className="clv-spacing-context__content">
            <header>
              <h2>Dados da clínica</h2>
              <p>Revise as informações antes de continuar.</p>
            </header>
            <Field
              help="Use o nome dos documentos oficiais."
              id="clinic-name"
              label="Nome da clínica"
              required
            >
              <Input defaultValue="Clínica Aurora" />
            </Field>
            <Alert status="info" title="Salvamento contínuo">
              Suas alterações ficam disponíveis para retomada.
            </Alert>
            <div className="clv-spacing-actions">
              <Button variant="secondary">Voltar</Button>
              <Button>Continuar</Button>
            </div>
          </div>
        </section>

        <section
          className="clv-spacing-context"
          data-clv-density="compact"
          data-testid="compact-context"
        >
          <DensityLabel>Compact · operação densa</DensityLabel>
          <div className="clv-spacing-context__content">
            <header>
              <h2>Operação de clínicas</h2>
              <p>Filtros e registros compartilham uma superfície de alta densidade.</p>
            </header>
            <div className="clv-spacing-filters">
              <Field id="search-clinic" label="Buscar clínica">
                <Input placeholder="Nome ou cidade" />
              </Field>
              <StatusBadge status="success">2 resultados</StatusBadge>
            </div>
            <ClinicTable />
          </div>
        </section>
      </div>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const defaultContext = canvas.getByTestId("default-context");
    const compactContext = canvas.getByTestId("compact-context");
    const defaultField = defaultContext.querySelector<HTMLElement>(".clv-field");
    const compactField = compactContext.querySelector<HTMLElement>(".clv-field");
    const defaultInput = defaultContext.querySelector<HTMLElement>(".clv-input");
    const compactInput = compactContext.querySelector<HTMLElement>(".clv-input");
    const compactCell = compactContext.querySelector<HTMLElement>(".clv-table__cell");
    const defaultLabelRow = defaultContext.querySelector<HTMLElement>(".clv-field__label-row");
    const compactLabelRow = compactContext.querySelector<HTMLElement>(".clv-field__label-row");

    if (
      !defaultField ||
      !compactField ||
      !defaultInput ||
      !compactInput ||
      !compactCell ||
      !defaultLabelRow ||
      !compactLabelRow
    ) {
      throw new Error("Amostra de densidade incompleta.");
    }

    await expect(getComputedStyle(defaultField).gap).toBe("0px");
    await expect(getComputedStyle(compactField).gap).toBe("0px");
    await expect(getComputedStyle(defaultLabelRow).marginBlockEnd).toBe("12px");
    await expect(getComputedStyle(compactLabelRow).marginBlockEnd).toBe("8px");
    await expect(getComputedStyle(defaultInput).minHeight).toBe("44px");
    await expect(getComputedStyle(compactInput).minHeight).toBe("44px");
    await expect(getComputedStyle(defaultInput).paddingInlineStart).toBe("12px");
    await expect(getComputedStyle(compactInput).paddingInlineStart).toBe("8px");
    await expect(getComputedStyle(compactCell).paddingBlockStart).toBe("12px");
  },
};

export const UsoEAntiuso: Story = {
  name: "Uso e antiuso",
  render: () => (
    <main className="clv-spacing-page">
      <Intro title="Escolha pelo relacionamento">
        Um valor só pertence à fundação quando descreve uma relação repetível. Geometria, dimensão e
        correção óptica continuam locais ao componente.
      </Intro>
      <div className="clv-spacing-guidance">
        <article className="clv-spacing-guidance__do">
          <h2>Use</h2>
          <ul>
            <li>Flow para ordenar irmãos na direção da leitura.</li>
            <li>Inset para o respiro interno de uma superfície.</li>
            <li>Grid para itens repetidos e alvos adjacentes.</li>
            <li>Section e gutter para a estrutura de página.</li>
          </ul>
        </article>
        <article className="clv-spacing-guidance__avoid">
          <h2>Evite</h2>
          <ul>
            <li>Escolher um token apenas porque o número parece correto.</li>
            <li>Usar spacing para altura de controle ou tamanho de ícone.</li>
            <li>Aplicar `compact` no elemento raiz do produto.</li>
            <li>Criar escala negativa ou converter o legado mecanicamente.</li>
          </ul>
        </article>
      </div>
      <section aria-labelledby="spacing-composition-title" className="clv-spacing-section">
        <header>
          <h2 id="spacing-composition-title">Composições de referência</h2>
          <p>Toolbar e diálogo usam os mesmos papéis sem compartilhar números locais.</p>
        </header>
        <div className="clv-spacing-compositions">
          <div aria-label="Ações de revisão" className="clv-spacing-toolbar" role="toolbar">
            <Button size="sm" variant="secondary">
              Filtrar
            </Button>
            <Button size="sm" variant="secondary">
              Exportar
            </Button>
          </div>
          <section
            aria-labelledby="spacing-dialog-title"
            aria-modal="false"
            className="clv-spacing-dialog"
            role="dialog"
          >
            <header>
              <h3 id="spacing-dialog-title">Descartar alterações?</h3>
              <p>O inset organiza a superfície; o flow organiza título, texto e ações.</p>
            </header>
            <div className="clv-spacing-actions">
              <Button size="sm" variant="secondary">
                Cancelar
              </Button>
              <Button size="sm" variant="danger">
                Descartar
              </Button>
            </div>
          </section>
        </div>
      </section>
      <aside className="clv-spacing-accessibility">
        <strong>Alvos interativos</strong>
        <p>
          A Clavia preserva 8 px entre ações adjacentes e prefere 44 × 44 px em contextos touch. O
          piso WCAG 2.2 AA continua sendo avaliado pelo tamanho ou pela exceção geométrica do
          critério 2.5.8.
        </p>
      </aside>
    </main>
  ),
};
