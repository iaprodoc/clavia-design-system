import { tokens } from "@clavia-ds/tokens";
import {
  Button,
  Field,
  Input,
  PageHeader,
  SaveStatus,
  StickyActionBar,
  Table,
} from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { expect, within } from "storybook/test";

import "./layout.css";

const clinics = [
  { city: "Fortaleza", id: "aurora", name: "Clínica Aurora", status: "Ativa" },
  { city: "Recife", id: "horizonte", name: "Clínica Horizonte", status: "Implantação" },
  { city: "Natal", id: "farol", name: "Clínica Farol", status: "Revisão" },
] as const;

const meta = {
  parameters: { layout: "fullscreen" },
  title: "Visão geral/Fundamentos/Layout",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Intro({ children, title }: { children: string; title: string }) {
  return (
    <header className="clv-layout-page__intro">
      <p className="clv-layout-page__eyebrow">Foundation · layout</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </header>
  );
}

export const ContratoResponsivo: Story = {
  name: "Contrato responsivo",
  render: () => (
    <main className="clv-layout-page">
      <Intro title="Estrutura com poucas decisões estáveis">
        Três faixas coordenam gutter e colunas sem substituir o comportamento intrínseco dos
        componentes. As larguras máximas vêm de padrões recorrentes em jornadas guiadas, interfaces
        operacionais e documentação.
      </Intro>

      <section aria-labelledby="layout-breakpoints" className="clv-layout-section">
        <header>
          <h2 id="layout-breakpoints">Faixas e grade</h2>
          <p>
            Compacta até 639 px; regular a partir de 640 px; expandida em 768 px; larga em 1024 px.
          </p>
        </header>
        <div className="clv-layout-breakpoints">
          {[
            { columns: 4, label: "Compacta", value: tokens.layout.breakpoint.regular },
            { columns: 8, label: "Regular", value: tokens.layout.breakpoint.expanded },
            { columns: 12, label: "Larga", value: tokens.layout.breakpoint.wide },
          ].map((item) => (
            <article key={item.label}>
              <strong>{item.label}</strong>
              <code>{item.value}</code>
              <span>{item.columns} colunas</span>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="layout-measures" className="clv-layout-section">
        <header>
          <h2 id="layout-measures">Larguras com intenção</h2>
          <p>O conteúdo escolhe uma medida pela tarefa; o viewport não decide sozinho.</p>
        </header>
        <ol className="clv-layout-measures">
          {Object.entries(tokens.layout.container).map(([name, value]) => (
            <li key={name} style={{ "--clv-layout-sample": value } as CSSProperties}>
              <code>container.{name}</code>
              <span aria-hidden="true" />
              <small>{value}</small>
            </li>
          ))}
        </ol>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Estrutura com poucas decisões estáveis",
    );
    await expect(canvas.getByText("12 colunas")).toBeVisible();
    await expect(canvasElement.querySelectorAll(".clv-layout-measures li")).toHaveLength(4);
  },
};

function ClinicTable() {
  return (
    <Table variant="plain">
      <Table.ScrollContainer>
        <Table.Content label="Clínicas" minWidth="36rem">
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
                <Table.Cell>{clinic.status}</Table.Cell>
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
    <main className="clv-layout-page clv-layout-page--pilots">
      <Intro title="O mesmo contrato em tarefas diferentes">
        Formulário guiado, leitura e operação densa usam os mesmos breakpoints, gutters e medidas,
        sem virar novos componentes antes de existir repetição suficiente.
      </Intro>

      <section aria-labelledby="guided-title" className="clv-layout-pilot clv-layout-pilot--guided">
        <PageHeader
          description="Cadastre as informações essenciais para iniciar a implantação."
          eyebrow="Etapa 1 de 3"
          title="Dados da clínica"
        />
        <form aria-labelledby="guided-title" className="clv-layout-guided-form">
          <h2 className="clv-sr-only" id="guided-title">
            Formulário guiado
          </h2>
          <Field id="layout-clinic" label="Nome da clínica" required>
            <Input placeholder="Ex.: Clínica Aurora" />
          </Field>
          <Field id="layout-city" label="Cidade">
            <Input placeholder="Fortaleza" />
          </Field>
        </form>
        <StickyActionBar
          previousAction={<Button variant="secondary">Voltar</Button>}
          primaryAction={<Button>Continuar</Button>}
          status={<SaveStatus status="saved" lastSavedAt="10:42" />}
        />
      </section>

      <div className="clv-layout-pilot-grid">
        <article
          aria-labelledby="reading-title"
          className="clv-layout-pilot clv-layout-pilot--reading"
        >
          <p className="clv-layout-page__eyebrow">Base de conhecimento</p>
          <h2 id="reading-title">Como preparar a equipe para a implantação</h2>
          <p>
            Uma largura de leitura limita o percurso dos olhos sem impor colunas artificiais. O
            texto continua fluido em 320 px e ganha respiro lateral conforme a tela cresce.
          </p>
          <p>
            Conteúdo de apoio permanece depois do conteúdo principal no DOM; quando não cabe ao
            lado, ele volta ao fluxo sem esconder informação ou exigir orientação específica do
            dispositivo.
          </p>
        </article>

        <section
          aria-labelledby="dense-title"
          className="clv-layout-pilot clv-layout-pilot--dense"
          data-clv-density="compact"
        >
          <header>
            <div>
              <p className="clv-layout-page__eyebrow">Operação</p>
              <h2 id="dense-title">Operação densa</h2>
            </div>
            <Button size="sm">Nova clínica</Button>
          </header>
          <ClinicTable />
        </section>
      </div>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("form")).toBeVisible();
    await expect(canvas.getByRole("grid", { name: "Clínicas" })).toBeVisible();
    await expect(canvas.getByText("Como preparar a equipe para a implantação")).toBeVisible();
  },
};

export const RegrasDeUso: Story = {
  name: "Regras de uso",
  render: () => (
    <main className="clv-layout-page">
      <Intro title="Layout organiza relações, não telas isoladas">
        Comece por fluxo, medida e prioridade de conteúdo. Acrescente colunas ou persistência
        somente quando o comportamento continuar válido entre produtos e tamanhos de viewport.
      </Intro>
      <section aria-label="Orientações" className="clv-layout-rules">
        <article>
          <h2>Faça</h2>
          <ul>
            <li>Garanta reflow em 320 px e zoom de 400%.</li>
            <li>Use gutter e gap por alias de Spacing.</li>
            <li>Mantenha o conteúdo principal primeiro no DOM.</li>
            <li>Prefira grid intrínseco quando a quantidade de colunas não for estrutural.</li>
          </ul>
        </article>
        <article>
          <h2>Evite</h2>
          <ul>
            <li>Tratar nomes compact, regular e wide como dispositivos.</li>
            <li>Esconder conteúdo essencial para caber em uma faixa.</li>
            <li>Criar pane fixo sem evidência de reuso entre contextos.</li>
            <li>Copiar os modos SM, MD, LG e XL do Surf como uma segunda escala.</li>
          </ul>
        </article>
      </section>
    </main>
  ),
};
