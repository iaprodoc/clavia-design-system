import { tokens } from "@clavia-ds/tokens";
import {
  Alert,
  Button,
  Checkbox,
  FileUpload,
  RadioGroup,
  StatusBadge,
  Table,
  Tabs,
  Tooltip,
} from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { expect, userEvent, within } from "storybook/test";

import "./border.css";

const widths = ["none", "thin", "thick"] as const;
const styles = ["none", "solid", "dashed"] as const;

const meta = {
  parameters: { layout: "fullscreen" },
  title: "Visão geral/Fundamentos/Border",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Intro({ children, title }: { children: string; title: string }) {
  return (
    <header className="clv-border-page__intro">
      <p className="clv-border-page__eyebrow">Foundation · border</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </header>
  );
}

export const Contrato: Story = {
  render: () => (
    <main className="clv-border-page">
      <Intro title="Limites claros, sem excesso de linhas">
        Três larguras e três estilos cobrem estrutura, controles e separadores. Cor, foco, cantos e
        profundidade continuam em suas próprias fundações.
      </Intro>

      <section aria-labelledby="border-widths" className="clv-border-section">
        <header>
          <h2 id="border-widths">Larguras</h2>
          <p>Zero remove o limite, 1 px estrutura o uso recorrente e 2 px reforça uma borda.</p>
        </header>
        <ol className="clv-border-grid">
          {widths.map((name) => (
            <li key={name}>
              <span
                aria-hidden="true"
                className="clv-border-sample"
                style={{ "--clv-border-sample-width": tokens.border.width[name] } as CSSProperties}
              />
              <code>border.width.{name}</code>
              <small>{tokens.border.width[name]}</small>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="border-styles" className="clv-border-section">
        <header>
          <h2 id="border-styles">Estilos</h2>
          <p>Solid é o padrão estrutural. Dashed sinaliza uma área de entrada ou ação.</p>
        </header>
        <ol className="clv-border-grid">
          {styles.map((name) => (
            <li key={name}>
              <span
                aria-hidden="true"
                className="clv-border-sample"
                style={{ "--clv-border-sample-style": tokens.border.style[name] } as CSSProperties}
              />
              <code>border.style.{name}</code>
              <small>{tokens.border.style[name]}</small>
            </li>
          ))}
        </ol>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("listitem")).toHaveLength(6);
    await expect(canvas.getByText("border.width.thick")).toBeVisible();
    await expect(canvas.getByText("border.style.dashed")).toBeVisible();
  },
};

function ClinicsTable() {
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content label="Clínicas" minWidth="28rem">
          <Table.Header>
            <Table.Column id="clinic" isRowHeader>
              Clínica
            </Table.Column>
            <Table.Column id="status">Status</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row id="aurora">
              <Table.Cell>Clínica Aurora</Table.Cell>
              <Table.Cell>Ativa</Table.Cell>
            </Table.Row>
            <Table.Row id="horizonte">
              <Table.Cell>Clínica Horizonte</Table.Cell>
              <Table.Cell>Implantação</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

export const ComposicoesPiloto: Story = {
  name: "Composições piloto",
  render: () => (
    <main className="clv-border-page">
      <Intro title="A borda acompanha a função">
        Controles usam limites estáveis, áreas de envio ganham ênfase tracejada e divisores seguem o
        fluxo lógico. Mudanças de estado preservam a geometria.
      </Intro>

      <section aria-labelledby="border-controls" className="clv-border-pilot">
        <header>
          <h2 id="border-controls">Controles</h2>
          <StatusBadge status="success">Contrato aplicado</StatusBadge>
        </header>
        <div className="clv-border-controls">
          <Button variant="secondary">Agendar consulta</Button>
          <Checkbox description="Receba um resumo por e-mail." label="Enviar confirmação" />
          <RadioGroup
            defaultValue="online"
            label="Modalidade"
            name="border-modality"
            options={[
              { label: "Online", value: "online" },
              { label: "Presencial", value: "in-person" },
            ]}
          />
          <Tooltip
            content="A cor muda; a largura permanece"
            defaultOpen
            triggerLabel="Sobre estados"
          >
            <span aria-hidden="true">?</span>
          </Tooltip>
        </div>
      </section>

      <section aria-labelledby="border-structure" className="clv-border-pilot">
        <header>
          <h2 id="border-structure">Estrutura e separação</h2>
          <p>Tabs preserva seu indicador local de 3 px; Table usa divisores lógicos de 1 px.</p>
        </header>
        <Tabs
          label="Dados da clínica"
          tabs={[
            { content: "Dados gerais da clínica.", id: "general", label: "Geral" },
            { content: "Regras de atendimento.", id: "service", label: "Atendimento" },
          ]}
          variant="secondary"
        />
        <ClinicsTable />
      </section>

      <section aria-labelledby="border-emphasis" className="clv-border-pilot">
        <header>
          <h2 id="border-emphasis">Ênfase e intenção</h2>
          <p>O tracejado é reservado a uma ação de entrada, não a decoração.</p>
        </header>
        <FileUpload
          description="Envie a relação atualizada de profissionais."
          helpText="PDF ou CSV de até 10 MB"
          onFileSelect={() => undefined}
          title="Equipe clínica"
        />
        <Alert status="info" title="Geometria estável">
          Hover, seleção e erro alteram principalmente a cor. A largura da borda não salta.
        </Alert>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Agendar consulta" });
    const widthBefore = getComputedStyle(button).borderInlineStartWidth;
    await userEvent.hover(button);
    await expect(getComputedStyle(button).borderInlineStartWidth).toBe(widthBefore);
    await expect(widthBefore).toBe("1px");
    await expect(
      getComputedStyle(canvas.getByRole("button", { name: /Arraste o/ })).borderStyle,
    ).toBe("dashed");
    await expect(canvas.getByRole("grid", { name: "Clínicas" })).toBeVisible();
  },
};

export const RegrasDeUso: Story = {
  name: "Regras de uso",
  render: () => (
    <main className="clv-border-page">
      <Intro title="Uma linha deve explicar algo">
        Use bordas para delimitar, separar ou sinalizar interação. Evite empilhar linha, sombra e
        contraste de superfície sem uma razão funcional.
      </Intro>
      <section className="clv-border-rules">
        <article>
          <h2>Border × Color</h2>
          <p>Largura e estilo ficam aqui. A cor e seus estados pertencem a color.border.*.</p>
        </article>
        <article>
          <h2>Border × Focus</h2>
          <p>O anel de foco não ocupa espaço nem altera a largura da borda do controle.</p>
        </article>
        <article>
          <h2>Border × Radius</h2>
          <p>Radius desenha os cantos; Border desenha a linha e respeita as emendas conectadas.</p>
        </article>
        <article>
          <h2>Border × Elevation</h2>
          <p>Borda separa regiões adjacentes. Elevação comunica profundidade entre planos.</p>
        </article>
        <article className="clv-border-rule--logical">
          <h2>Direção de fluxo</h2>
          <p>Divisores parciais usam block e inline para funcionar em LTR e RTL.</p>
        </article>
        <article className="clv-border-rule--avoid">
          <h2>Evite decoração vazia</h2>
          <p>Não use tracejado, hairline ou borda grossa apenas para preencher uma superfície.</p>
        </article>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("article")).toHaveLength(6);
    await expect(canvas.getByRole("heading", { name: "Direção de fluxo" })).toBeVisible();
  },
};
