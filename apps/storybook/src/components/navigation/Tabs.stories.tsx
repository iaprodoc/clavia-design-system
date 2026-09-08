import { Tabs } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { expect, userEvent, waitFor, within } from "storybook/test";

const segmentedTabs = [
  {
    content: "Consulte o panorama do projeto e as atividades mais recentes.",
    id: "visao-geral",
    label: "Visão geral",
  },
  {
    content: "Acompanhe indicadores, tendências e pontos que exigem atenção.",
    id: "analises",
    label: "Análises",
  },
  {
    content: "Encontre os relatórios disponíveis para consulta e compartilhamento.",
    id: "relatorios",
    label: "Relatórios",
  },
] as const;

const settingsTabs = [
  { content: "Dados gerais e identificação da clínica.", id: "geral", label: "Geral" },
  { content: "Horários, intervalos e regras de agenda.", id: "agenda", label: "Agenda" },
  {
    content: "Sem acesso nesta fase.",
    disabled: true,
    id: "integracoes",
    label: "Integrações",
  },
] as const;

const accountTabs = [
  {
    content: (
      <div className="clv-story-tabs-panel-content">
        <h3>Configurações da conta</h3>
        <p>Gerencie seus dados, preferências e informações de contato.</p>
      </div>
    ),
    id: "conta",
    label: "Conta",
  },
  {
    content: (
      <div className="clv-story-tabs-panel-content">
        <h3>Segurança</h3>
        <p>Revise sua senha, autenticação e sessões ativas.</p>
      </div>
    ),
    id: "seguranca",
    label: "Segurança",
  },
  {
    content: (
      <div className="clv-story-tabs-panel-content">
        <h3>Notificações</h3>
        <p>Escolha quando e por quais canais você deseja receber avisos.</p>
      </div>
    ),
    id: "notificacoes",
    label: "Notificações",
  },
  {
    content: (
      <div className="clv-story-tabs-panel-content">
        <h3>Cobrança</h3>
        <p>Consulte o plano, as formas de pagamento e o histórico de cobranças.</p>
      </div>
    ),
    id: "cobranca",
    label: "Cobrança",
  },
] as const;

const overflowTabs = [
  { content: "Dados gerais.", id: "geral", label: "Geral" },
  { content: "Dados de agenda.", id: "agenda", label: "Agenda" },
  { content: "Dados da equipe.", id: "equipe", label: "Equipe clínica" },
  { content: "Dados financeiros.", id: "financeiro", label: "Financeiro" },
  { content: "Dados de integrações.", id: "integracoes", label: "Integrações" },
  { content: "Dados de auditoria.", id: "auditoria", label: "Auditoria" },
  { content: "Dados de segurança.", id: "seguranca", label: "Segurança" },
  { content: "Dados de notificações.", id: "notificacoes", label: "Notificações" },
] as const;

const meta = {
  args: {
    hideSeparator: false,
    keyboardActivation: "automatic",
    label: "Seções do projeto",
    orientation: "horizontal",
    showSeparators: false,
    tabs: segmentedTabs,
    variant: "primary",
  },
  argTypes: {
    activeId: {
      control: "text",
      description: "Alias Clavia para seleção controlada. Prefira selectedKey em novos usos.",
    },
    children: {
      control: false,
      description:
        "Anatomia composta com Tabs.ListContainer, List, Tab, Indicator, Separator e Panel.",
    },
    defaultActiveId: {
      control: "text",
      description: "Alias Clavia para defaultSelectedKey.",
    },
    defaultSelectedKey: {
      control: "text",
      description: "Identificador inicialmente selecionado no modo não controlado.",
    },
    hideSeparator: {
      control: "boolean",
      description: "Oculta os separadores declarados na anatomia composta.",
    },
    isDisabled: {
      control: "boolean",
      description: "Desabilita a interação do conjunto inteiro.",
    },
    keyboardActivation: {
      control: "inline-radio",
      options: ["automatic", "manual"],
      description: "Define se o foco por setas seleciona imediatamente ou exige confirmação.",
    },
    label: {
      control: "text",
      description: "Nome acessível do tablist na API de conveniência.",
    },
    nextLabel: {
      control: "text",
      description: "Nome acessível localizado do controle de avanço no overflow.",
    },
    onActiveIdChange: {
      control: false,
      description: "Alias Clavia para onSelectionChange.",
    },
    onSelectionChange: {
      control: false,
      description: "Notifica a chave selecionada no contrato canônico.",
    },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      description: "Orienta lista, teclado, indicador e overflow no mesmo eixo.",
    },
    previousLabel: {
      control: "text",
      description: "Nome acessível localizado do controle de retorno no overflow.",
    },
    selectedKey: {
      control: "text",
      description: "Identificador selecionado no modo controlado.",
    },
    showSeparators: {
      control: "boolean",
      description: "Insere separadores entre os itens da API de conveniência.",
    },
    tabs: {
      control: "object",
      description: "Coleção de conveniência com id, label, content, disabled e ariaLabel opcional.",
    },
    variant: {
      control: "inline-radio",
      options: ["primary", "secondary"],
      description: "Primária preenchida ou secundária com indicador linear.",
    },
  },
  component: Tabs,
  decorators: [
    (Story, context) => (
      <div
        className={
          context.parameters.tabsPreview === "showcase"
            ? "clv-story-tabs-showcase-preview"
            : "clv-story-tabs-preview"
        }
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Tabs da Clavia para alternar áreas relacionadas no mesmo contexto. O catálogo documenta a matriz pública e sua composição estrutural, preservando os tokens, a linguagem e os contratos do Design System.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Componentes/Navegação/Tabs",
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primaria: Story = {
  name: "Padrão",
  parameters: {
    docs: {
      description: {
        story:
          "Trilho neutro de 40 px, abas de 32 px com a mesma largura e indicador branco elevado. O painel começa 8 px abaixo do trilho.",
      },
    },
  },
  render: (args) => <Tabs {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const overview = canvas.getByRole("tab", { name: "Visão geral" });

    overview.focus();
    await userEvent.keyboard("{ArrowRight}");

    const analytics = canvas.getByRole("tab", { name: "Análises" });
    const reports = canvas.getByRole("tab", { name: "Relatórios" });
    const tabList = canvas.getByRole("tablist", { name: "Seções do projeto" });
    const listContainer = tabList.closest<HTMLElement>(".clv-tabs__list-container");
    const indicator = analytics.querySelector<HTMLElement>(".clv-tabs__indicator");

    if (!indicator || !listContainer) {
      throw new Error("Estrutura visual da variante primária não encontrada.");
    }

    const tabWidths = [overview, analytics, reports].map(
      (tab) => tab.getBoundingClientRect().width,
    );

    await expect(analytics).toHaveAttribute("aria-selected", "true");
    await waitFor(() => expect(getComputedStyle(analytics).height).toBe("32px"));
    await expect(getComputedStyle(listContainer).height).toBe("40px");
    await expect(getComputedStyle(listContainer).borderRadius).toBe("20px");
    await expect(getComputedStyle(indicator).backgroundColor).toBe("rgb(255, 255, 255)");
    await expect(getComputedStyle(indicator).boxShadow).not.toBe("none");
    await expect(Math.max(...tabWidths) - Math.min(...tabWidths)).toBeLessThanOrEqual(1);
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("indicadores, tendências");
    analytics.blur();
  },
};

export const ComOverflow: Story = {
  name: "Transbordamento",
  parameters: {
    docs: {
      description: {
        story:
          "Em 400 px, os rótulos preservam a largura de conteúdo e o trilho oferece controles transparentes de avanço e retorno, sem criar botões elevados dentro da navegação.",
      },
    },
  },
  render: () => (
    <Tabs
      className="clv-story-tabs-overflow-preview"
      label="Configurações avançadas"
      tabs={overflowTabs}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tabList = canvas.getByRole("tablist", { name: "Configurações avançadas" });
    const listContainer = tabList.closest<HTMLElement>(".clv-tabs__list-container");

    if (!listContainer) throw new Error("Trilho horizontal dos Tabs não encontrado.");

    const scrollNext = listContainer.querySelector<HTMLButtonElement>(
      '[aria-label="Rolar abas para frente"]',
    );

    if (!scrollNext) throw new Error("Controle de avanço dos Tabs não encontrado.");

    await waitFor(() => expect(scrollNext).toBeVisible());
    await expect(scrollNext).toHaveAttribute("tabindex", "-1");
    await expect(getComputedStyle(scrollNext).width).toBe("16px");
    await expect(getComputedStyle(scrollNext).backgroundColor).toBe("rgba(0, 0, 0, 0)");
    await expect(getComputedStyle(scrollNext).boxShadow).toBe("none");
  },
};

export const Vertical: Story = {
  name: "Vertical",
  parameters: {
    docs: {
      description: {
        story:
          "A mesma variante primária no eixo vertical: lista compacta de 32 px por item e painel esticado na coluna à direita.",
      },
    },
  },
  render: () => (
    <Tabs
      defaultSelectedKey="conta"
      label="Seções da conta"
      orientation="vertical"
      tabs={accountTabs}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selectedTab = canvas.getByRole("tab", { name: "Conta" });
    const listContainer = canvas
      .getByRole("tablist", { name: "Seções da conta" })
      .closest<HTMLElement>(".clv-tabs__list-container");
    const indicator = selectedTab.querySelector<HTMLElement>(".clv-tabs__indicator");
    const panel = canvas.getByRole("tabpanel");

    if (!listContainer || !indicator) {
      throw new Error("Estrutura visual da variante vertical não encontrada.");
    }

    await expect(getComputedStyle(selectedTab).height).toBe("32px");
    await expect(getComputedStyle(listContainer).height).toBe("148px");
    await expect(getComputedStyle(listContainer).borderRadius).toBe("20px");
    await expect(getComputedStyle(indicator).backgroundColor).toBe("rgb(255, 255, 255)");
    await expect(getComputedStyle(indicator).boxShadow).not.toBe("none");
    await expect(panel.getBoundingClientRect().height).toBe(
      listContainer.getBoundingClientRect().height,
    );
    await expect(
      panel.getBoundingClientRect().left - listContainer.getBoundingClientRect().right,
    ).toBe(8);
    await expect(panel).toHaveTextContent("Gerencie seus dados");
  },
};

export const ComAbaDesativada: Story = {
  name: "Com a guia desativada",
  render: () => <Tabs label="Configurações da clínica" tabs={settingsTabs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const disabledTab = canvas.getByRole("tab", { name: "Integrações" });

    await expect(disabledTab).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(disabledTab);
    await expect(disabledTab).toHaveAttribute("aria-selected", "false");
    await expect(canvas.getByRole("tab", { name: "Geral" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  },
};

export const SelecaoInicial: Story = {
  name: "Com a guia selecionada por padrão",
  render: () => (
    <Tabs defaultSelectedKey="analises" label="Seções do projeto" tabs={segmentedTabs} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("tab", { name: "Análises" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("indicadores, tendências");
  },
};

function ControlledTabsPreview() {
  const [selectedKey, setSelectedKey] = useState("agenda");

  return (
    <div className="clv-story-tabs-controlled">
      <p aria-live="polite">Selecionada: {selectedKey}</p>
      <Tabs
        label="Configurações controladas"
        onSelectionChange={(key) => setSelectedKey(String(key))}
        selectedKey={selectedKey}
        tabs={settingsTabs}
      />
    </div>
  );
}

export const SelecaoControlada: Story = {
  name: "Com guia de seleção controlada",
  parameters: {
    docs: {
      description: {
        story:
          "selectedKey e onSelectionChange formam o contrato controlado. activeId e onActiveIdChange permanecem como aliases de compatibilidade.",
      },
    },
  },
  render: () => <ControlledTabsPreview />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("tab", { name: "Geral" }));
    await expect(canvas.getByText("Selecionada: geral")).toBeVisible();
    await expect(canvas.getByRole("tab", { name: "Geral" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  },
};

export const ComEstiloPersonalizado: Story = {
  name: "Com estilo personalizado",
  parameters: {
    docs: {
      description: {
        story:
          "A anatomia composta personaliza cada parte sem criar uma nova variante: trilho de 32 px, itens de 24 px e indicador na cor da ação primária.",
      },
    },
  },
  render: () => (
    <Tabs className="clv-story-tabs-custom" defaultSelectedKey="quinzenal">
      <Tabs.ListContainer>
        <Tabs.List aria-label="Período do relatório">
          <Tabs.Tab id="diario">
            Diário
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="semanal">
            Semanal
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="quinzenal">
            Quinzenal
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="mensal">
            Mensal
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
      <Tabs.Panel className="clv-story-tabs-custom__panel" id="diario">
        Resultados consolidados do dia.
      </Tabs.Panel>
      <Tabs.Panel className="clv-story-tabs-custom__panel" id="semanal">
        Resultados consolidados da semana.
      </Tabs.Panel>
      <Tabs.Panel className="clv-story-tabs-custom__panel" id="quinzenal">
        Resultados consolidados da quinzena.
      </Tabs.Panel>
      <Tabs.Panel className="clv-story-tabs-custom__panel" id="mensal">
        Resultados consolidados do mês.
      </Tabs.Panel>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selectedTab = canvas.getByRole("tab", { name: "Quinzenal" });
    const indicator = selectedTab.querySelector<HTMLElement>(".clv-tabs__indicator");

    if (!indicator) throw new Error("Indicador personalizado não encontrado.");

    await expect(getComputedStyle(canvas.getByRole("tablist")).height).toBe("32px");
    await expect(getComputedStyle(selectedTab).height).toBe("24px");
    await expect(getComputedStyle(indicator).backgroundColor).toBe("rgb(34, 78, 130)");
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("Resultados consolidados");
    await expect(getComputedStyle(canvas.getByRole("tabpanel")).position).toBe("absolute");
  },
};

export const ComSeparador: Story = {
  name: "Com Separador",
  parameters: {
    docs: {
      description: {
        story:
          "Os divisores ficam entre itens não selecionados e desaparecem junto à seleção para não competir com o indicador.",
      },
    },
  },
  render: () => (
    <Tabs
      defaultSelectedKey="analises"
      label="Seções com separadores"
      showSeparators
      tabs={segmentedTabs}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const separators = canvasElement.querySelectorAll<HTMLElement>('[data-slot="tabs-separator"]');

    await expect(separators).toHaveLength(2);
    await expect(canvas.getByRole("tab", { name: "Análises" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  },
};

type ShowcaseChart = "area" | "bars" | "donut" | "line" | "radial" | "stacked";

const defaultShowcasePeriod = {
  caption: "Últimos 30 dias",
  chart: "stacked" as const,
  delta: "+8,7%",
  id: "30d",
  insight: "em relação aos 30 dias anteriores",
  label: "30 dias",
  value: "286",
};

const showcasePeriods: ReadonlyArray<{
  caption: string;
  chart: ShowcaseChart;
  delta: string;
  id: string;
  insight: string;
  label: string;
  value: string;
}> = [
  {
    caption: "Agenda de hoje",
    chart: "bars",
    delta: "14 de 18",
    id: "hoje",
    insight: "atendimentos já concluídos",
    label: "Hoje",
    value: "18",
  },
  {
    caption: "Últimos 7 dias",
    chart: "area",
    delta: "+12,1%",
    id: "7d",
    insight: "em relação à semana anterior",
    label: "7 dias",
    value: "74",
  },
  {
    caption: "Últimos 14 dias",
    chart: "donut",
    delta: "66%",
    id: "14d",
    insight: "foram retornos de pacientes",
    label: "14 dias",
    value: "139",
  },
  defaultShowcasePeriod,
  {
    caption: "Últimos 60 dias",
    chart: "bars",
    delta: "+6,4%",
    id: "60d",
    insight: "crescimento no volume semanal",
    label: "60 dias",
    value: "541",
  },
  {
    caption: "Últimos 90 dias",
    chart: "radial",
    delta: "82%",
    id: "90d",
    insight: "ocupação média da agenda",
    label: "90 dias",
    value: "812",
  },
  {
    caption: "Últimos 6 meses",
    chart: "line",
    delta: "+18,3%",
    id: "6m",
    insight: "comparado ao semestre anterior",
    label: "6 meses",
    value: "1.624",
  },
  {
    caption: "Últimos 12 meses",
    chart: "stacked",
    delta: "+24,8%",
    id: "12m",
    insight: "crescimento acumulado no ano",
    label: "12 meses",
    value: "3.118",
  },
];

const chartColors = {
  accent: "var(--clv-color-accent-secondary)",
  grid: "var(--clv-color-border-subtle)",
  primary: "var(--clv-color-action-primary)",
  secondary: "var(--clv-color-status-info)",
  text: "var(--clv-color-text-muted)",
} as const;

const todayData = [
  { concluídos: 2, horário: "08h", previstos: 3 },
  { concluídos: 3, horário: "10h", previstos: 4 },
  { concluídos: 2, horário: "12h", previstos: 2 },
  { concluídos: 3, horário: "14h", previstos: 4 },
  { concluídos: 2, horário: "16h", previstos: 3 },
  { concluídos: 2, horário: "18h", previstos: 2 },
];

const weeklyData = [
  { atual: 8, anterior: 7, período: "Seg" },
  { atual: 11, anterior: 9, período: "Ter" },
  { atual: 9, anterior: 10, período: "Qua" },
  { atual: 13, anterior: 11, período: "Qui" },
  { atual: 15, anterior: 12, período: "Sex" },
  { atual: 10, anterior: 9, período: "Sáb" },
  { atual: 8, anterior: 8, período: "Dom" },
];

const returnData = [
  { fill: chartColors.primary, name: "Retornos", value: 92 },
  { fill: chartColors.accent, name: "Primeiras consultas", value: 47 },
];

const channelData = [
  { indicação: 21, orgânico: 26, período: "Sem 1", reativação: 13 },
  { indicação: 24, orgânico: 29, período: "Sem 2", reativação: 16 },
  { indicação: 27, orgânico: 33, período: "Sem 3", reativação: 15 },
  { indicação: 31, orgânico: 35, período: "Sem 4", reativação: 17 },
];

const sixtyDayData = [
  { atendimentos: 58, período: "Sem 1" },
  { atendimentos: 62, período: "Sem 2" },
  { atendimentos: 65, período: "Sem 3" },
  { atendimentos: 61, período: "Sem 4" },
  { atendimentos: 69, período: "Sem 5" },
  { atendimentos: 72, período: "Sem 6" },
  { atendimentos: 75, período: "Sem 7" },
  { atendimentos: 79, período: "Sem 8" },
];

const capacityData = [
  { fill: chartColors.primary, name: "Clínica Aurora", value: 88 },
  { fill: chartColors.secondary, name: "Clínica Horizonte", value: 81 },
  { fill: chartColors.accent, name: "Clínica Serena", value: 76 },
];

const semesterData = [
  { atual: 218, anterior: 186, período: "Mar" },
  { atual: 242, anterior: 205, período: "Abr" },
  { atual: 251, anterior: 217, período: "Mai" },
  { atual: 274, anterior: 226, período: "Jun" },
  { atual: 298, anterior: 243, período: "Jul" },
  { atual: 341, anterior: 286, período: "Ago" },
];

const yearData = [
  { indicação: 84, orgânico: 102, período: "Set", reativação: 43 },
  { indicação: 91, orgânico: 110, período: "Out", reativação: 47 },
  { indicação: 96, orgânico: 118, período: "Nov", reativação: 51 },
  { indicação: 89, orgânico: 113, período: "Dez", reativação: 49 },
  { indicação: 104, orgânico: 126, período: "Jan", reativação: 54 },
  { indicação: 112, orgânico: 134, período: "Fev", reativação: 58 },
  { indicação: 119, orgânico: 142, período: "Mar", reativação: 63 },
  { indicação: 126, orgânico: 151, período: "Abr", reativação: 66 },
  { indicação: 132, orgânico: 158, período: "Mai", reativação: 69 },
  { indicação: 139, orgânico: 166, período: "Jun", reativação: 73 },
  { indicação: 146, orgânico: 174, período: "Jul", reativação: 78 },
  { indicação: 154, orgânico: 183, período: "Ago", reativação: 82 },
];

const tooltipStyle = {
  background: "var(--clv-color-surface-raised)",
  border: "var(--clv-border-width-thin) solid var(--clv-color-border-subtle)",
  borderRadius: "var(--clv-shape-control)",
  boxShadow: "var(--clv-elevation-floating)",
  color: "var(--clv-color-text-primary)",
  fontSize: "var(--clv-font-size-xs)",
};

function ChartFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div aria-label={label} className="clv-story-tabs-showcase__chart" role="img">
      <div aria-hidden="true" className="clv-story-tabs-showcase__chart-inner">
        {children}
      </div>
    </div>
  );
}

function ActivityChart({
  chart,
  label,
}: Pick<(typeof showcasePeriods)[number], "chart" | "label">) {
  const chartLabel = `Gráfico de atendimentos em ${label}`;

  if (chart === "area") {
    return (
      <ChartFrame label={chartLabel}>
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart data={weeklyData} margin={{ bottom: 8, left: -16, right: 8, top: 16 }}>
            <defs>
              <linearGradient id="tabs-area-current" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.26} />
                <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 5" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="período"
              tickLine={false}
              tick={{ fill: chartColors.text }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: chartColors.text }} width={36} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: chartColors.grid }} />
            <Legend iconType="circle" iconSize={8} />
            <Area
              dataKey="anterior"
              fill="transparent"
              isAnimationActive={false}
              name="Semana anterior"
              stroke={chartColors.accent}
              strokeDasharray="5 5"
              strokeWidth={2}
              type="monotone"
            />
            <Area
              dataKey="atual"
              fill="url(#tabs-area-current)"
              isAnimationActive={false}
              name="Semana atual"
              stroke={chartColors.primary}
              strokeWidth={3}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartFrame>
    );
  }

  if (chart === "donut") {
    return (
      <ChartFrame label={chartLabel}>
        <div className="clv-story-tabs-showcase__donut">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                cornerRadius={7}
                data={returnData}
                dataKey="value"
                innerRadius="62%"
                isAnimationActive={false}
                nameKey="name"
                outerRadius="86%"
                paddingAngle={3}
                stroke="none"
              >
                {returnData.map((entry) => (
                  <Cell fill={entry.fill} key={entry.name} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
          <span className="clv-story-tabs-showcase__donut-value">
            <strong>66%</strong>
            <span className="clv-story-tabs-showcase__donut-label">retornos</span>
          </span>
        </div>
      </ChartFrame>
    );
  }

  if (chart === "radial") {
    return (
      <ChartFrame label={chartLabel}>
        <ResponsiveContainer height="100%" width="100%">
          <RadialBarChart
            cx="50%"
            cy="48%"
            data={capacityData}
            endAngle={-270}
            innerRadius="24%"
            outerRadius="88%"
            startAngle={90}
          >
            <RadialBar
              background={{ fill: chartColors.grid }}
              cornerRadius={8}
              dataKey="value"
              isAnimationActive={false}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconType="circle" iconSize={8} verticalAlign="bottom" />
          </RadialBarChart>
        </ResponsiveContainer>
      </ChartFrame>
    );
  }

  if (chart === "line") {
    return (
      <ChartFrame label={chartLabel}>
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={semesterData} margin={{ bottom: 8, left: -8, right: 8, top: 16 }}>
            <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 5" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="período"
              tickLine={false}
              tick={{ fill: chartColors.text }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: chartColors.text }} width={42} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: chartColors.grid }} />
            <Legend iconType="circle" iconSize={8} />
            <Line
              dataKey="anterior"
              dot={false}
              isAnimationActive={false}
              name="Semestre anterior"
              stroke={chartColors.accent}
              strokeDasharray="5 5"
              strokeWidth={2}
              type="monotone"
            />
            <Line
              activeDot={{ r: 5 }}
              dataKey="atual"
              dot={{ fill: chartColors.primary, r: 3, strokeWidth: 0 }}
              isAnimationActive={false}
              name="Semestre atual"
              stroke={chartColors.primary}
              strokeWidth={3}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartFrame>
    );
  }

  const data = chart === "stacked" && label === "12 meses" ? yearData : channelData;

  return (
    <ChartFrame label={chartLabel}>
      <ResponsiveContainer height="100%" width="100%">
        <BarChart
          data={
            chart === "bars" && label === "Hoje"
              ? todayData
              : chart === "bars"
                ? sixtyDayData
                : data
          }
          margin={{ bottom: 8, left: -8, right: 8, top: 16 }}
        >
          <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 5" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey={label === "Hoje" ? "horário" : "período"}
            tickLine={false}
            tick={{ fill: chartColors.text }}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: chartColors.text }} width={42} />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: "var(--clv-color-surface-sunken)" }}
          />
          <Legend iconType="circle" iconSize={8} />
          {label === "Hoje" ? (
            <Bar
              dataKey="previstos"
              fill={chartColors.accent}
              isAnimationActive={false}
              name="Previstos"
              radius={[5, 5, 0, 0]}
            />
          ) : null}
          {label === "Hoje" ? (
            <Bar
              dataKey="concluídos"
              fill={chartColors.primary}
              isAnimationActive={false}
              name="Concluídos"
              radius={[5, 5, 0, 0]}
            />
          ) : null}
          {label !== "Hoje" && chart === "bars" ? (
            <Bar
              dataKey="atendimentos"
              fill={chartColors.primary}
              isAnimationActive={false}
              name="Atendimentos"
              radius={[6, 6, 0, 0]}
            />
          ) : null}
          {chart === "stacked" ? (
            <Bar
              dataKey="orgânico"
              fill={chartColors.primary}
              isAnimationActive={false}
              name="Orgânico"
              radius={[0, 0, 5, 5]}
              stackId="a"
            />
          ) : null}
          {chart === "stacked" ? (
            <Bar
              dataKey="indicação"
              fill={chartColors.secondary}
              isAnimationActive={false}
              name="Indicação"
              stackId="a"
            />
          ) : null}
          {chart === "stacked" ? (
            <Bar
              dataKey="reativação"
              fill={chartColors.accent}
              isAnimationActive={false}
              name="Reativação"
              radius={[5, 5, 0, 0]}
              stackId="a"
            />
          ) : null}
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

function ActivityVisual({
  caption,
  chart,
  delta,
  insight,
  label,
  value,
}: (typeof showcasePeriods)[number]) {
  return (
    <div className="clv-story-tabs-showcase__visual">
      <div className="clv-story-tabs-showcase__visual-header">
        <span className="clv-story-tabs-showcase__visual-title">
          <span className="clv-story-tabs-showcase__visual-kicker">Atendimentos realizados</span>
          <strong>{caption}</strong>
        </span>
        <span className="clv-story-tabs-showcase__metric">
          <strong>{value}</strong>
          <span className="clv-story-tabs-showcase__metric-label">atendimentos</span>
        </span>
      </div>
      <ActivityChart chart={chart} label={label} />
      <p className="clv-story-tabs-showcase__insight">
        <strong>{delta}</strong>
        <span className="clv-story-tabs-showcase__insight-label">{insight}</span>
      </p>
    </div>
  );
}

function ShowcaseTabsPreview() {
  const [selectedKey, setSelectedKey] = useState("30d");
  const selected =
    showcasePeriods.find((period) => period.id === selectedKey) ?? defaultShowcasePeriod;

  return (
    <div className="clv-story-tabs-showcase">
      <Tabs
        className="clv-story-tabs-showcase__tabs"
        onSelectionChange={(key) => setSelectedKey(String(key))}
        selectedKey={selectedKey}
      >
        <Tabs.ListContainer>
          <Tabs.List aria-label="Período de atividade">
            {showcasePeriods.map((period) => (
              <Tabs.Tab id={period.id} key={period.id}>
                {period.label}
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
        {showcasePeriods.map((period) => (
          <Tabs.Panel className="clv-story-tabs-showcase__panel" id={period.id} key={period.id}>
            <ActivityVisual {...period} />
          </Tabs.Panel>
        ))}
      </Tabs>
      <p aria-live="polite" className="clv-story-tabs-showcase__summary">
        {selected.caption}: <strong>{selected.value} atendimentos</strong>
      </p>
    </div>
  );
}

export const Vitrine: Story = {
  name: "Vitrine/Períodos de atividade",
  parameters: {
    docs: {
      description: {
        story:
          "Composição contextual para análise de atendimentos: oito períodos alternam visualizações responsivas com dados fictícios, eixos, legendas e tooltips. Os gráficos usam Recharts apenas nesta demonstração; Tabs continua sem dependência de visualização de dados.",
      },
    },
    tabsPreview: "showcase",
  },
  render: () => <ShowcaseTabsPreview />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const label of ["7 dias", "14 dias", "30 dias", "90 dias"]) {
      await userEvent.click(canvas.getByRole("tab", { name: label }));
      await expect(
        canvas.getByRole("img", { name: `Gráfico de atendimentos em ${label}` }),
      ).toBeVisible();
    }

    await expect(canvas.getByText("Últimos 90 dias:", { exact: false })).toHaveTextContent(
      "Últimos 90 dias: 812 atendimentos",
    );
    await expect(canvas.getByRole("tab", { name: "90 dias" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(
      canvas.getByRole("img", { name: "Gráfico de atendimentos em 90 dias" }),
    ).toBeVisible();
    canvas.getByRole("tab", { name: "90 dias" }).blur();
  },
};

export const Secundaria: Story = {
  name: "Secundária",
  parameters: {
    docs: {
      description: {
        story:
          "As abas de 32 px dividem a largura sobre uma linha de 1 px; a seleção ocupa a base do item com um indicador reto de 2 px.",
      },
    },
  },
  render: () => (
    <Tabs
      defaultSelectedKey="visao-geral"
      label="Seções secundárias"
      tabs={segmentedTabs}
      variant="secondary"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selectedTab = canvas.getByRole("tab", { name: "Visão geral" });
    const tabs = canvas.getAllByRole("tab");
    const listContainer = canvas
      .getByRole("tablist", { name: "Seções secundárias" })
      .closest<HTMLElement>(".clv-tabs__list-container");
    const indicator = selectedTab.querySelector<HTMLElement>(".clv-tabs__indicator");

    if (!listContainer || !indicator) {
      throw new Error("Trilho ou indicador secundário não encontrado.");
    }

    const tabWidths = tabs.map((tab) => tab.getBoundingClientRect().width);
    await expect(getComputedStyle(listContainer).height).toBe("33px");
    await expect(getComputedStyle(listContainer).borderBottomWidth).toBe("1px");
    await expect(getComputedStyle(indicator).height).toBe("2px");
    await expect(getComputedStyle(indicator).bottom).toBe("0px");
    await expect(getComputedStyle(indicator).borderRadius).toBe("0px");
    await expect(getComputedStyle(indicator).backgroundColor).toBe("rgb(86, 178, 237)");
    await expect(Math.max(...tabWidths) - Math.min(...tabWidths)).toBeLessThanOrEqual(1);
  },
};

export const VerticalSecundaria: Story = {
  name: "Vertical secundária",
  parameters: {
    docs: {
      description: {
        story:
          "A linha de 1 px passa à lateral; o indicador reto de 2 px ocupa o início do item selecionado e o painel permanece à direita.",
      },
    },
  },
  render: () => (
    <Tabs
      defaultSelectedKey="conta"
      label="Seções secundárias da conta"
      orientation="vertical"
      tabs={accountTabs}
      variant="secondary"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selectedTab = canvas.getByRole("tab", { name: "Conta" });
    const listContainer = canvas
      .getByRole("tablist", { name: "Seções secundárias da conta" })
      .closest<HTMLElement>(".clv-tabs__list-container");
    const indicator = selectedTab.querySelector<HTMLElement>(".clv-tabs__indicator");

    if (!listContainer || !indicator) {
      throw new Error("Trilho ou indicador vertical secundário não encontrado.");
    }

    await expect(getComputedStyle(listContainer).height).toBe("140px");
    await expect(getComputedStyle(listContainer).borderLeftWidth).toBe("1px");
    await expect(getComputedStyle(indicator).width).toBe("2px");
    await expect(getComputedStyle(indicator).left).toBe("0px");
    await expect(getComputedStyle(indicator).borderRadius).toBe("0px");
    await expect(getComputedStyle(indicator).backgroundColor).toBe("rgb(86, 178, 237)");
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("Gerencie seus dados");
  },
};
