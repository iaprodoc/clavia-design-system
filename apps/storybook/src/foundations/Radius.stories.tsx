import { tokens } from "@clavia-ds/tokens";
import { Alert, Button, Field, Input, StatusBadge, Table, Tabs, Tooltip } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { expect, userEvent, within } from "storybook/test";

import "./radius.css";

const primitiveOrder = ["none", "xs", "sm", "md", "lg", "xl", "pill"] as const;
const semanticOrder = ["none", "control", "surface", "overlay", "pill"] as const;

const clinics = [
  { city: "Fortaleza", id: "aurora", name: "Clínica Aurora" },
  { city: "Recife", id: "horizonte", name: "Clínica Horizonte" },
] as const;

const meta = {
  parameters: { layout: "fullscreen" },
  title: "Visão geral/Fundamentos/Radius",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Intro({ children, title }: { children: string; title: string }) {
  return (
    <header className="clv-radius-page__intro">
      <p className="clv-radius-page__eyebrow">Foundation · radius</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </header>
  );
}

function pixelValue(value: string) {
  return value.endsWith("rem") ? `${Number.parseFloat(value) * 16}px` : value;
}

export const Contrato: Story = {
  render: () => (
    <main className="clv-radius-page">
      <Intro title="Cantos que explicam a estrutura">
        Superfícies e overlays usam 16 px, definidos pela tabela. Controles usam 12 px para manter
        uma leitura retangular na sua altura compacta; a escala continua disponível para geometria
        pequena, cantos conectados, círculos e cápsulas.
      </Intro>

      <section aria-labelledby="radius-scale" className="clv-radius-section">
        <header>
          <h2 id="radius-scale">Escala preservada</h2>
          <p>Zero e 4 px completam o contrato já distribuído de 8, 12, 16, 24 e 999 px.</p>
        </header>
        <ol className="clv-radius-scale">
          {primitiveOrder.map((name) => {
            const value = tokens.radius[name];
            return (
              <li key={name}>
                <span
                  aria-hidden="true"
                  className="clv-radius-scale__shape"
                  style={{ "--clv-radius-sample": value } as CSSProperties}
                />
                <code>radius.{name}</code>
                <small>{pixelValue(value)}</small>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="radius-roles" className="clv-radius-section">
        <header>
          <h2 id="radius-roles">Papéis semânticos</h2>
          <p>O papel descreve a função; o alias continua apontando para uma primitiva.</p>
        </header>
        <dl className="clv-radius-roles">
          {semanticOrder.map((name) => (
            <div key={name}>
              <dt>
                <code>shape.{name}</code>
              </dt>
              <dd>{pixelValue(tokens.shape[name])}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("listitem")).toHaveLength(7);
    await expect(canvas.getByText("shape.surface")).toBeVisible();
  },
};

function ClinicTable() {
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content label="Clínicas" minWidth="28rem">
          <Table.Header>
            <Table.Column id="clinic" isRowHeader>
              Clínica
            </Table.Column>
            <Table.Column id="city">Cidade</Table.Column>
          </Table.Header>
          <Table.Body>
            {clinics.map((clinic) => (
              <Table.Row id={clinic.id} key={clinic.id}>
                <Table.Cell>{clinic.name}</Table.Cell>
                <Table.Cell>{clinic.city}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

export const ComposicoesPiloto: Story = {
  name: "Composições piloto",
  render: () => (
    <main className="clv-radius-page">
      <Intro title="Raio na escala certa">
        Controles usam 12 px; superfícies e overlays, 16 px. Tamanho, estado, densidade e viewport
        não mudam essa relação; cápsulas, círculos e emendas conectadas preservam a própria
        geometria.
      </Intro>

      <section aria-labelledby="radius-controls" className="clv-radius-pilot">
        <header>
          <h2 id="radius-controls">Controles e cápsulas</h2>
          <StatusBadge status="success">Contrato aplicado</StatusBadge>
        </header>
        <div className="clv-radius-controls">
          <Button size="sm">Ação pequena</Button>
          <Button>Ação principal</Button>
          <Field id="radius-clinic" label="Nome da clínica">
            <Input placeholder="Clínica Aurora" />
          </Field>
          <Tooltip content="Raio de overlay: 16 px" defaultOpen triggerLabel="Sobre o radius">
            <span aria-hidden="true">?</span>
          </Tooltip>
          <Alert title="Superfície padronizada">Alertas usam o mesmo raio da tabela.</Alert>
        </div>
      </section>

      <section aria-labelledby="radius-connected" className="clv-radius-pilot">
        <header>
          <h2 id="radius-connected">Continuidade e agrupamento</h2>
          <p>
            O raio do grupo respeita o limite da superfície; emendas compartilhadas permanecem
            retas.
          </p>
        </header>
        <fieldset className="clv-radius-connected">
          <legend className="clv-sr-only">Período</legend>
          <button type="button">Hoje</button>
          <button type="button">7 dias</button>
          <button type="button">30 dias</button>
        </fieldset>
        <Tabs
          label="Dados da clínica"
          tabs={[
            { content: "Dados gerais.", id: "geral", label: "Geral" },
            { content: "Regras de agenda.", id: "agenda", label: "Agenda" },
          ]}
        />
      </section>

      <section aria-labelledby="radius-surfaces" className="clv-radius-pilot">
        <header>
          <h2 id="radius-surfaces">Superfície e aninhamento</h2>
          <p>
            A curva interna acompanha a externa, com proteção quando o inset se aproxima do raio.
          </p>
        </header>
        <div className="clv-radius-nested">
          <div>
            <strong>Clínicas em implantação</strong>
            <span>2 registros ativos</span>
          </div>
        </div>
        <ClinicTable />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const smallButton = canvas.getByRole("button", { name: "Ação pequena" });
    const radiusBefore = getComputedStyle(smallButton).borderRadius;
    await userEvent.hover(smallButton);
    await expect(getComputedStyle(smallButton).borderRadius).toBe(radiusBefore);
    await expect(
      getComputedStyle(canvas.getByRole("group", { name: "Período" })).borderRadius,
    ).toBe("16px");
    await expect(
      getComputedStyle(canvas.getByRole("textbox", { name: "Nome da clínica" })).borderRadius,
    ).toBe("12px");
    await expect(getComputedStyle(canvas.getByRole("status")).borderRadius).toBe("16px");
    await expect(canvas.getByRole("grid", { name: "Clínicas" })).toBeVisible();
  },
};

export const RegrasDeUso: Story = {
  name: "Regras de uso",
  render: () => (
    <main className="clv-radius-page">
      <Intro title="A curva segue a relação">
        Radius comunica agrupamento e hierarquia. Ele não substitui espaçamento, borda, elevação nem
        uma área de toque adequada.
      </Intro>
      <section className="clv-radius-rules">
        <article>
          <h2>Superfícies padronizadas</h2>
          <p>
            Use <code>shape.control</code> em inputs, selects e textareas: 12 px. Para superfícies e
            overlays, use <code>shape.surface</code> e <code>shape.overlay</code>: 16 px, como a
            tabela.
          </p>
        </article>
        <article>
          <h2>Connected corners</h2>
          <p>Zere apenas as emendas. Preserve a curva no perímetro que continua visível.</p>
        </article>
        <article>
          <h2>Nested corners</h2>
          <p>Use a relação raio externo menos inset como referência e valide a curva resultante.</p>
        </article>
        <article>
          <h2>Pill não é Circle</h2>
          <p>Pill usa 999 px. Circle exige proporção 1:1 e 50%; a geometria é o contrato.</p>
        </article>
        <article>
          <h2>Foco sem recorte</h2>
          <p>Não aplique clipping ao ancestral que precisa exibir um anel de foco externo.</p>
        </article>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("article")).toHaveLength(5);
    await expect(canvas.getByRole("heading", { name: "Pill não é Circle" })).toBeVisible();
  },
};
