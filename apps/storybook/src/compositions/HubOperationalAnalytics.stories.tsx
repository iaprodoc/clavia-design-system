import { BuildingIcon, CircleCheckIcon, TrendingUpIcon, TriangleAlertIcon } from "@clavia-ds/icons";
import {
  Alert,
  Button,
  DataTable,
  EmptyState,
  ErrorState,
  FilterBar,
  LinkButton,
  LoadingState,
  MetricCard,
  PageHeader,
  Section,
  StatusBadge,
  Switch,
  ToggleGroup,
  ToggleGroupItem,
} from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { HubApplicationShell07 } from "../components/layout/HubApplicationShell07";
import { Phase3AdvancedFilter } from "./Phase3AdvancedFilter";
import {
  formatCompositionDate,
  formatCompositionDateTime,
  formatCompositionInteger,
  formatCompositionPercentage,
} from "./phase-4-formatters";
import "./hub-operational-analytics.css";

type ViewState = "empty" | "error" | "loading" | "success";
type ProjectStatus = "attention" | "healthy" | "review";

const projects = [
  {
    activityPeriod: "recent",
    id: "aurora",
    name: "Clínica Aurora",
    status: "attention",
    statusLabel: "Atenção necessária",
    updatedAt: new Date("2026-08-31T12:12:00.000Z"),
  },
  {
    activityPeriod: "recent",
    id: "horizonte",
    name: "Instituto Horizonte",
    status: "review",
    statusLabel: "Em revisão",
    updatedAt: new Date("2026-08-31T11:48:00.000Z"),
  },
  {
    activityPeriod: "older",
    id: "manaca",
    name: "Clínica Manacá",
    status: "healthy",
    statusLabel: "Operação estável",
    updatedAt: new Date("2026-08-31T10:30:00.000Z"),
  },
] as const;

const periodStart = new Date("2026-08-25T03:00:00.000Z");
const periodEnd = new Date("2026-09-01T02:59:00.000Z");
const metricPeriod = `Período: ${formatCompositionDate(periodStart)} a ${formatCompositionDate(periodEnd)}.`;

const activityOptions = [
  { label: "Qualquer atualização", value: "all" },
  { label: "Última hora", value: "recent" },
  { label: "Há uma hora ou mais", value: "older" },
] as const;

const statusKind = {
  attention: "warning",
  healthy: "success",
  review: "info",
} as const;

const projectColumns = [
  {
    id: "project",
    isRowHeader: true,
    label: "Projeto",
    render: (project: (typeof projects)[number]) => project.name,
  },
  {
    id: "status",
    label: "Status operacional",
    render: (project: (typeof projects)[number]) => (
      <StatusBadge status={statusKind[project.status]} variant="soft">
        {project.statusLabel}
      </StatusBadge>
    ),
  },
  {
    id: "activity",
    label: "Atualização confirmada",
    render: (project: (typeof projects)[number]) => formatCompositionDateTime(project.updatedAt),
  },
] as const;

function OperationalAnalytics({
  state = "success",
  withinAppShell = false,
}: {
  state?: ViewState;
  withinAppShell?: boolean;
}) {
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [activity, setActivity] = useState("all");
  const [isPriorityVisible, setIsPriorityVisible] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState("aurora");
  const [weeklyReport, setWeeklyReport] = useState(true);
  const filteredProjects = projects.filter(
    (project) =>
      (status === "all" || project.status === status) &&
      (activity === "all" || project.activityPeriod === activity),
  );
  const activeFilterCount = Number(status !== "all") + Number(activity !== "all");
  const selectedProject =
    filteredProjects.find((project) => project.id === selectedProjectId) ?? filteredProjects[0];
  const rootClassName = [
    "clv-hub-operational-analytics",
    withinAppShell ? "clv-hub-operational-analytics--app-shell" : null,
  ]
    .filter(Boolean)
    .join(" ");

  if (state === "loading") {
    return (
      <div className={rootClassName}>
        <LoadingState
          description="Métricas, projetos e alertas serão exibidos quando a consulta terminar."
          label="Carregando visão operacional"
        />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className={rootClassName}>
        <ErrorState
          action={<Button>Tentar novamente</Button>}
          description="Não foi possível atualizar os indicadores desta demonstração. Verifique a fonte de dados e tente de novo."
          title="A visão operacional não foi carregada"
        />
      </div>
    );
  }

  if (state === "empty") {
    return (
      <div className={rootClassName}>
        <EmptyState
          action={<LinkButton href="#configuracoes">Ver configurações de coleta</LinkButton>}
          description="Os indicadores aparecerão depois da primeira coleta concluída para este projeto."
          title="Ainda não há dados operacionais"
        />
      </div>
    );
  }

  return (
    <div className={rootClassName}>
      <PageHeader
        description={
          <>
            Acompanhe sinais recentes e priorize a próxima ação. Cálculos, séries e regras de
            negócio continuam no produto.
          </>
        }
        title="Visão operacional"
      />

      {isPriorityVisible ? (
        <div className="clv-hub-operational-analytics__priority">
          <Alert
            actions={
              <Button size="sm" variant="outline">
                Ver integrações
              </Button>
            }
            metadata={
              <>
                <StatusBadge status="warning" variant="soft">
                  1 projeto com conexão interrompida
                </StatusBadge>
                <StatusBadge leadingIcon={<BuildingIcon />}>Clínica Aurora</StatusBadge>
              </>
            }
            onDismiss={() => setIsPriorityVisible(false)}
            status="warning"
            title="Uma integração precisa de atenção"
            variant="featured"
          >
            A conexão deixou de receber eventos há 18 minutos. Revise a integração antes de agir
            sobre os dados recebidos.
          </Alert>
        </div>
      ) : null}

      <section
        aria-label="Indicadores do período"
        className="clv-hub-operational-analytics__metrics"
      >
        <div className="clv-hub-operational-analytics__metrics-context">
          <div>
            <h2>Indicadores do período</h2>
            <p>{metricPeriod}</p>
          </div>
          <p className="clv-hub-operational-analytics__metrics-note">
            Valores e tendências usam dados fictícios e determinísticos.
          </p>
        </div>
        <MetricCard
          description="Volume disponível para priorização da equipe."
          label="Novos leads"
          tag={
            <StatusBadge size="xs" variant="soft">
              +18 leads
            </StatusBadge>
          }
          tone="neutral"
          trend={
            <span className="clv-hub-operational-analytics__metric-trend">
              <TrendingUpIcon />
              Tendência neutra
            </span>
          }
          value={formatCompositionInteger(126)}
        />
        <MetricCard
          description="A taxa segue a regra de cálculo definida pelo projeto."
          label="Conversão em agendamento"
          tag={
            <StatusBadge size="xs" status="success" variant="soft">
              +4,2 p.p.
            </StatusBadge>
          }
          tone="success"
          trend={
            <span className="clv-hub-operational-analytics__metric-trend">
              <CircleCheckIcon />
              Acima da semana anterior
            </span>
          }
          value={formatCompositionPercentage(0.421)}
        />
        <MetricCard
          description="Confirme a conexão antes de agir sobre os dados recebidos."
          label="Integrações interrompidas"
          tag={
            <StatusBadge size="xs" status="warning" variant="soft">
              1 alerta
            </StatusBadge>
          }
          tone="warning"
          trend={
            <span className="clv-hub-operational-analytics__metric-trend">
              <TriangleAlertIcon />
              Requer reconexão
            </span>
          }
          value={formatCompositionInteger(1)}
        />
      </section>

      <Section
        actions={<LinkButton href="#relatorio">Abrir último relatório</LinkButton>}
        description={
          selectedProject
            ? `Seleção atual: ${selectedProject.name} · ${selectedProject.statusLabel}. Registros comparáveis para consulta rápida; detalhes, rotas e agregações pertencem ao Hub.`
            : "Registros comparáveis para consulta rápida; detalhes, rotas e agregações pertencem ao Hub."
        }
        title="Projetos recentes"
      >
        <div className="clv-hub-operational-analytics__project-list">
          <FilterBar
            aria-label="Filtros da visão operacional"
            className="clv-hub-operational-analytics__filters"
            {...(activeFilterCount
              ? {
                  onClear: () => {
                    setStatus("all");
                    setActivity("all");
                  },
                }
              : {})}
            onSubmit={(event) => event.preventDefault()}
            summary={
              activeFilterCount
                ? `${activeFilterCount} ${activeFilterCount === 1 ? "filtro aplicado" : "filtros aplicados"} · ${filteredProjects.length} ${filteredProjects.length === 1 ? "resultado" : "resultados"}`
                : `Todos os projetos visíveis · ${filteredProjects.length} resultados`
            }
          >
            <ToggleGroup
              aria-label="Status do projeto"
              onValueChange={(value) => setStatus((value || "all") as ProjectStatus | "all")}
              size="sm"
              type="single"
              value={status}
            >
              <ToggleGroupItem value="all">Todos</ToggleGroupItem>
              <ToggleGroupItem value="attention">Atenção</ToggleGroupItem>
              <ToggleGroupItem value="review">Revisão</ToggleGroupItem>
              <ToggleGroupItem value="healthy">Estáveis</ToggleGroupItem>
            </ToggleGroup>
            <Phase3AdvancedFilter
              fieldLabel="Última atualização"
              onApply={setActivity}
              options={activityOptions}
              title="Filtros avançados de projetos"
              value={activity}
            />
          </FilterBar>
          <div className="clv-hub-operational-analytics__table-surface">
            <DataTable
              columns={projectColumns}
              emptyDescription="Remova o filtro ou aguarde a próxima coleta."
              emptyTitle="Nenhum projeto neste status"
              getRowId={(project) => project.id}
              label="Projetos recentes"
              minWidth="42rem"
              onSelectionChange={(keys) => {
                if (keys !== "all") {
                  const [firstKey] = [...keys];
                  if (firstKey) setSelectedProjectId(String(firstKey));
                }
              }}
              rows={filteredProjects}
              selectedKeys={selectedProject ? new Set([selectedProject.id]) : new Set()}
              selectionMode="single"
            />
          </div>
        </div>
      </Section>

      <Section
        description="A preferência é local ao projeto e a persistência continua sob responsabilidade do Hub."
        title="Relatórios automáticos"
      >
        <Switch
          checked={weeklyReport}
          description="Envia um resumo semanal quando a integração necessária está disponível."
          label="Relatório semanal automático"
          onChange={(event) => setWeeklyReport(event.target.checked)}
        />
      </Section>

      <aside aria-label="Limite do contrato" className="clv-hub-operational-analytics__boundary">
        A composição organiza alertas, filtros, métricas, registros e ações. Consultas, cálculos,
        gráficos, permissões, links de relatório e gravação de preferências não são contratos do
        Design System.
      </aside>
    </div>
  );
}

const meta = {
  component: OperationalAnalytics,
  parameters: {
    docs: {
      description: {
        component:
          "Composição de leitura operacional do Hub. Alert destacado, FilterBar, MetricCard, DataTable, LinkButton e Switch resolvem a apresentação e as interações locais. Filtros e tabela formam uma pilha com largura integral e espaçamento de seção. Dados, agregações, gráficos, rotas e persistência continuam no produto.",
      },
    },
    layout: "fullscreen",
  },
  title: "Composições/Hub/Visão operacional",
} satisfies Meta<typeof OperationalAnalytics>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sucesso: Story = {
  name: "Sucesso",
  play: async ({ canvasElement }) => {
    const filterBar = within(canvasElement).getByRole("form", {
      name: "Filtros da visão operacional",
    });
    const projectList = canvasElement.querySelector(".clv-hub-operational-analytics__project-list");
    const composition = canvasElement.querySelector(".clv-hub-operational-analytics");
    const tableSurface = canvasElement.querySelector(
      ".clv-hub-operational-analytics__table-surface",
    );
    const table = tableSurface?.querySelector(".clv-table");

    if (
      !(projectList instanceof HTMLElement) ||
      !(composition instanceof HTMLElement) ||
      !(tableSurface instanceof HTMLElement) ||
      !(table instanceof HTMLElement)
    ) {
      throw new Error("A lista de projetos, seus filtros e sua tabela devem estar presentes.");
    }

    const filterBounds = filterBar.getBoundingClientRect();
    const tableSurfaceBounds = tableSurface.getBoundingClientRect();
    const tableBounds = table.getBoundingClientRect();
    const expectedGap = Number.parseFloat(getComputedStyle(projectList).rowGap);

    await expect(getComputedStyle(composition).maxInlineSize).toBe("1152px");
    await expect(Math.abs(filterBounds.width - tableSurfaceBounds.width)).toBeLessThanOrEqual(1);
    await expect(Math.abs(tableBounds.width - tableSurfaceBounds.width)).toBeLessThanOrEqual(1);
    await expect(
      Math.abs(tableSurfaceBounds.top - filterBounds.bottom - expectedGap),
    ).toBeLessThanOrEqual(1);
  },
};

export const ComAppShell: Story = {
  name: "Com AppShell",
  parameters: {
    docs: {
      description: {
        story:
          "Referência de composição fluida: o AppShell controla a área útil e os gutters externos; a Visão operacional ocupa 100% do canvas e acompanha o reflow quando a Sidebar recolhe. A variante isolada mantém o limite de 1152px para demonstração fora do shell.",
      },
    },
  },
  render: () => (
    <HubApplicationShell07 key="visao-operacional">
      <OperationalAnalytics withinAppShell />
    </HubApplicationShell07>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("main")).toBeVisible();
    await expect(canvas.getByRole("complementary", { name: "Navegação principal" })).toBeVisible();
    await expect(canvas.getByRole("img", { name: "Clavia Hub" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: /Digite para buscar/ })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Ver atividade recente" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: /Pessoas e acessos/ })).toBeVisible();
    await expect(canvas.getByRole("heading", { name: "Visão operacional" })).toBeVisible();
    await expect(canvas.getByRole("region", { name: "Novos leads" })).toBeVisible();
    expect(canvasElement.querySelector(".clv-application-shell-07")).not.toBeNull();
    const compositionCanvas = canvasElement.querySelector<HTMLElement>(
      ".clv-application-shell-07__canvas--composition",
    );

    expect(compositionCanvas).not.toBeNull();
    expect(
      compositionCanvas?.contains(canvas.getByRole("heading", { name: "Visão operacional" })),
    ).toBe(true);
    expect(getComputedStyle(compositionCanvas as HTMLElement).borderRadius).not.toBe("0px");
    expect(getComputedStyle(compositionCanvas as HTMLElement).overflow).toBe("clip");
    const composition = canvasElement.querySelector<HTMLElement>(
      ".clv-hub-operational-analytics--app-shell",
    );

    expect(composition).not.toBeNull();
    expect(getComputedStyle(composition as HTMLElement).maxInlineSize).toBe("none");
    const expandedBounds = composition?.getBoundingClientRect();

    await userEvent.click(canvas.getByRole("button", { name: "Recolher navegação" }));
    await expect(canvas.getByRole("button", { name: "Expandir navegação" })).toBeVisible();
    await waitFor(() => {
      const collapsedBounds = composition?.getBoundingClientRect();

      expect(expandedBounds).toBeDefined();
      expect(collapsedBounds).toBeDefined();
      if (expandedBounds && collapsedBounds) {
        expect(collapsedBounds.width - expandedBounds.width).toBeGreaterThan(100);
        expect(expandedBounds.left - collapsedBounds.left).toBeGreaterThan(100);
        expect(Math.abs(collapsedBounds.right - expandedBounds.right)).toBeLessThanOrEqual(1);
      }
    });
    await userEvent.click(canvas.getByRole("button", { name: "Expandir navegação" }));
    await expect(canvas.getByRole("button", { name: "Recolher navegação" })).toBeVisible();
  },
};

export const Interacoes: Story = {
  ...Sucesso,
  name: "Interações críticas",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("alert", { name: "Uma integração precisa de atenção" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Fechar alerta" }));
    await expect(
      canvas.queryByRole("alert", { name: "Uma integração precisa de atenção" }),
    ).not.toBeInTheDocument();
    await expect(canvas.getByRole("heading", { name: "Indicadores do período" })).toBeVisible();
    await expect(canvas.getByText("42,1%")).toBeVisible();
    await expect(canvas.getByText("31 de ago. de 2026 · 09:12")).toBeVisible();
    await expect(canvas.getByRole("region", { name: "Novos leads" })).toHaveTextContent(
      "Tendência neutra",
    );
    await expect(
      canvas.getByRole("region", { name: "Conversão em agendamento" }),
    ).toHaveTextContent("Acima da semana anterior");
    await expect(
      canvas.getByRole("region", { name: "Integrações interrompidas" }),
    ).toHaveTextContent("Requer reconexão");
    await userEvent.click(canvas.getByRole("row", { name: /Instituto Horizonte/ }));
    await expect(canvas.getByText(/Seleção atual: Instituto Horizonte/)).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Atenção" }));
    await expect(canvas.getByRole("rowheader", { name: "Clínica Aurora" })).toBeVisible();
    await expect(canvas.queryByText("Instituto Horizonte")).not.toBeInTheDocument();

    const body = within(canvasElement.ownerDocument.body);
    const advancedTrigger = canvas.getByRole("button", { name: "Filtros" });
    await userEvent.click(advancedTrigger);
    await body.findByRole("dialog", {
      name: "Filtros avançados de projetos",
    });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(advancedTrigger).toHaveFocus());
    await expect(canvas.getByText("1 filtro aplicado · 1 resultado")).toBeVisible();

    await userEvent.click(advancedTrigger);
    const appliedPanel = await body.findByRole("dialog", {
      name: "Filtros avançados de projetos",
    });
    await userEvent.click(within(appliedPanel).getByRole("button", { name: /Última atualização/ }));
    await userEvent.click(await body.findByRole("option", { name: "Última hora" }));
    await userEvent.click(within(appliedPanel).getByRole("button", { name: "Aplicar filtros" }));
    await expect(canvas.getByText("2 filtros aplicados · 1 resultado")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Limpar filtros" }));
    await expect(canvas.queryByRole("button", { name: "Limpar filtros" })).not.toBeInTheDocument();

    const reportLink = canvas.getByRole("link", { name: "Abrir último relatório" });
    reportLink.focus();
    await expect(reportLink).toHaveAttribute("href", "#relatorio");
    await expect(reportLink).toHaveFocus();

    const reportToggle = canvas.getByRole("switch", { name: "Relatório semanal automático" });
    await userEvent.click(reportToggle);
    await expect(reportToggle).not.toBeChecked();
    await userEvent.keyboard(" ");
    await expect(reportToggle).toBeChecked();
  },
};

export const Carregando: Story = {
  args: { state: "loading" },
  name: "Carregando",
};

export const Vazio: Story = {
  args: { state: "empty" },
  name: "Vazio",
};

export const Erro: Story = {
  args: { state: "error" },
  name: "Erro",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const retry = canvas.getByRole("button", { name: "Tentar novamente" });
    retry.focus();
    await expect(retry).toHaveFocus();
  },
};
