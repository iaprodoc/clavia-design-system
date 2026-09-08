import {
  Button,
  DataTable,
  Dialog,
  EmptyState,
  ErrorState,
  FilterBar,
  LoadingState,
  PageHeader,
  SearchField,
  Section,
  StatusBadge,
  ToggleGroup,
  ToggleGroupItem,
} from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { Phase3AdvancedFilter } from "./Phase3AdvancedFilter";
import "./hub-conversation-inspection.css";

type ConversationStatus = "complete" | "recommendation" | "review";
type ViewState = "empty" | "error" | "loading" | "success";

const conversations = [
  {
    id: "c-004",
    messages: 18,
    name: "Contato 004",
    origin: "Indicação",
    status: "review",
    statusLabel: "Requer revisão",
  },
  {
    id: "c-012",
    messages: 11,
    name: "Contato 012",
    origin: "Campanha",
    status: "recommendation",
    statusLabel: "Recomendação disponível",
  },
  {
    id: "c-021",
    messages: 24,
    name: "Contato 021",
    origin: "Orgânico",
    status: "complete",
    statusLabel: "Concluída",
  },
] as const;

const originOptions = [
  { label: "Todas as origens", value: "all" },
  { label: "Indicação", value: "Indicação" },
  { label: "Campanha", value: "Campanha" },
  { label: "Orgânico", value: "Orgânico" },
] as const;

const statusKind = {
  complete: "success",
  recommendation: "info",
  review: "warning",
} as const;

const columns = [
  {
    id: "conversation",
    isRowHeader: true,
    label: "Conversa",
    render: (conversation: (typeof conversations)[number]) => conversation.name,
  },
  {
    id: "origin",
    label: "Origem",
    render: (conversation: (typeof conversations)[number]) => conversation.origin,
  },
  {
    id: "messages",
    label: "Mensagens",
    render: (conversation: (typeof conversations)[number]) => String(conversation.messages),
  },
  {
    id: "status",
    label: "Resultado da inspeção",
    render: (conversation: (typeof conversations)[number]) => (
      <StatusBadge status={statusKind[conversation.status]} variant="soft">
        {conversation.statusLabel}
      </StatusBadge>
    ),
  },
] as const;

function ConversationInspection({ state = "success" }: { state?: ViewState }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ConversationStatus | "all">("all");
  const [origin, setOrigin] = useState("all");
  const [selectedId, setSelectedId] = useState<string>("c-004");
  const [recommendationReviewed, setRecommendationReviewed] = useState(false);
  const filteredConversations = conversations.filter(
    (conversation) =>
      (status === "all" || conversation.status === status) &&
      (origin === "all" || conversation.origin === origin) &&
      conversation.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  const activeFilterCount =
    Number(Boolean(query)) + Number(status !== "all") + Number(origin !== "all");
  const selectedConversation = conversations.find((conversation) => conversation.id === selectedId);

  if (state === "loading") {
    return (
      <main className="clv-hub-conversation-inspection">
        <LoadingState
          description="As conversas e resultados serão exibidos quando a consulta terminar."
          label="Carregando inspeção de conversas"
        />
      </main>
    );
  }

  if (state === "error") {
    return (
      <main className="clv-hub-conversation-inspection">
        <ErrorState
          action={<Button>Tentar novamente</Button>}
          description="Não foi possível recuperar os resultados desta demonstração. Verifique a fonte de dados e tente de novo."
          title="A inspeção de conversas não foi carregada"
        />
      </main>
    );
  }

  if (state === "empty") {
    return (
      <main className="clv-hub-conversation-inspection">
        <EmptyState
          action={<Button>Executar nova análise</Button>}
          description="Quando a análise concluir, as conversas e recomendações aparecerão aqui."
          title="Nenhuma análise disponível"
        />
      </main>
    );
  }

  return (
    <main className="clv-hub-conversation-inspection">
      <PageHeader
        actions={
          <Dialog
            actions={<Button>Iniciar análise</Button>}
            description="A escolha de período, inbox e execução pertence ao Hub."
            title="Executar nova análise"
            trigger="Executar nova análise"
            triggerVariant="primary"
          >
            <p>Este diálogo demonstra abertura, fechamento e retorno de foco sem enviar dados.</p>
          </Dialog>
        }
        description="Localize uma conversa, filtre os resultados e revise a próxima recomendação. A execução e o conteúdo da análise continuam no produto."
        title="Análise de conversas"
        variant="plain"
      />

      <Section
        description="Use busca e filtros para localizar uma conversa. A seleção é local a esta demonstração."
        title="Conversas analisadas"
      >
        <div className="clv-hub-conversation-inspection__results-region">
          <FilterBar
            aria-label="Filtros da inspeção de conversas"
            className="clv-hub-conversation-inspection__filters"
            {...(activeFilterCount
              ? {
                  onClear: () => {
                    setQuery("");
                    setStatus("all");
                    setOrigin("all");
                  },
                }
              : {})}
            onSubmit={(event) => event.preventDefault()}
            summary={
              activeFilterCount
                ? `${activeFilterCount} ${activeFilterCount === 1 ? "filtro aplicado" : "filtros aplicados"} · ${filteredConversations.length} ${filteredConversations.length === 1 ? "resultado" : "resultados"}`
                : `Todas as conversas visíveis · ${filteredConversations.length} resultados`
            }
          >
            <SearchField
              label="Buscar conversa"
              onChange={setQuery}
              placeholder="Buscar por contato"
              value={query}
            />
            <ToggleGroup
              aria-label="Resultado da análise"
              onValueChange={(value) => setStatus((value || "all") as ConversationStatus | "all")}
              size="sm"
              type="single"
              value={status}
            >
              <ToggleGroupItem value="all">Todas</ToggleGroupItem>
              <ToggleGroupItem value="review">Revisão</ToggleGroupItem>
              <ToggleGroupItem value="recommendation">Recomendação</ToggleGroupItem>
              <ToggleGroupItem value="complete">Concluídas</ToggleGroupItem>
            </ToggleGroup>
            <Phase3AdvancedFilter
              fieldLabel="Origem"
              onApply={setOrigin}
              options={originOptions}
              title="Filtros de conversas"
              value={origin}
            />
          </FilterBar>

          <div className="clv-hub-conversation-inspection__table-surface">
            <DataTable
              columns={columns}
              emptyDescription="Remova filtros ou execute uma análise que retorne conversas."
              emptyTitle="Nenhuma conversa encontrada"
              getRowId={(conversation) => conversation.id}
              label="Conversas analisadas"
              minWidth="44rem"
              onSelectionChange={(keys) => {
                if (keys !== "all") {
                  const [firstKey] = [...keys];
                  if (firstKey) {
                    setSelectedId(String(firstKey));
                    setRecommendationReviewed(false);
                  }
                }
              }}
              rows={filteredConversations}
              selectedKeys={new Set([selectedId])}
              selectionMode="single"
            />
          </div>
        </div>
      </Section>

      <div className="clv-hub-conversation-inspection__details">
        <div className="clv-hub-conversation-inspection__detail-surface">
          <Section
            description={
              selectedConversation
                ? `Seleção atual: ${selectedConversation.name}.`
                : "Selecione uma conversa para consultar o contexto."
            }
            title="Detalhe selecionado"
          >
            <p className="clv-hub-conversation-inspection__copy">
              {selectedConversation
                ? `Resumo demonstrativo: ${selectedConversation.name} chegou por ${selectedConversation.origin}, tem ${selectedConversation.messages} mensagens e está marcada como “${selectedConversation.statusLabel}”. A transcrição não é exibida nesta composição.`
                : "A transcrição, classificações e momentos da conversa não são exibidos nesta composição."}
            </p>
          </Section>
        </div>

        <div className="clv-hub-conversation-inspection__recommendation-surface">
          <Section title="Próxima recomendação">
            <div className="clv-hub-conversation-inspection__recommendation">
              <div className="clv-hub-conversation-inspection__recommendation-content">
                <StatusBadge status={recommendationReviewed ? "info" : "warning"} variant="soft">
                  {recommendationReviewed ? "Em revisão" : "Alta prioridade"}
                </StatusBadge>
                <h3 className="clv-hub-conversation-inspection__recommendation-title">
                  Retomada de contato
                </h3>
                <p className="clv-hub-conversation-inspection__recommendation-description">
                  Ajustar a primeira resposta para confirmar o canal de retorno antes da oferta.
                </p>
                <p aria-live="polite" className="clv-hub-conversation-inspection__review-status">
                  {recommendationReviewed
                    ? "Recomendação marcada para revisão nesta demonstração."
                    : "Recomendação pronta para revisão."}
                </p>
              </div>
              <Button onClick={() => setRecommendationReviewed(true)} size="sm" variant="secondary">
                {recommendationReviewed ? "Revisar novamente" : "Revisar recomendação"}
              </Button>
            </div>
          </Section>
        </div>
      </div>

      <aside aria-label="Limite do contrato" className="clv-hub-conversation-inspection__boundary">
        Busca de grupos, execução, seleção de período, conteúdo gerado, transcrições, recomendações,
        permissões e dados de conversa permanecem no Hub.
      </aside>
    </main>
  );
}

const meta = {
  component: ConversationInspection,
  parameters: {
    docs: {
      description: {
        component:
          "Composição de inspeção do Hub. SearchField, FilterBar, DataTable e Dialog organizam busca, filtro, seleção e abertura de diálogo. A recomendação combina status, contexto e uma ação explícita, sem transformar o conteúdo inteiro em botão; sua descrição usa a medida de leitura do sistema em colunas largas. Execução, dados de conversa e conteúdo gerado permanecem no produto.",
      },
    },
    layout: "fullscreen",
  },
  title: "Composições/Hub/Inspeção de conversas",
} satisfies Meta<typeof ConversationInspection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sucesso: Story = {
  name: "Sucesso",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const filterBar = canvas.getByRole("form", { name: "Filtros da inspeção de conversas" });
    const resultsRegion = canvasElement.querySelector(
      ".clv-hub-conversation-inspection__results-region",
    );
    const tableSurface = canvasElement.querySelector(
      ".clv-hub-conversation-inspection__table-surface",
    );

    if (!(resultsRegion instanceof HTMLElement) || !(tableSurface instanceof HTMLElement)) {
      throw new Error("A região de resultados e a superfície da tabela devem estar presentes.");
    }

    const filterBounds = filterBar.getBoundingClientRect();
    const tableBounds = tableSurface.getBoundingClientRect();
    const expectedGap = Number.parseFloat(getComputedStyle(resultsRegion).rowGap);

    await expect(Math.abs(filterBounds.width - tableBounds.width)).toBeLessThanOrEqual(1);
    await expect(Math.abs(tableBounds.top - filterBounds.bottom - expectedGap)).toBeLessThanOrEqual(
      1,
    );

    const recommendation = canvasElement.querySelector(
      ".clv-hub-conversation-inspection__recommendation",
    );
    const recommendationContent = canvasElement.querySelector(
      ".clv-hub-conversation-inspection__recommendation-content",
    );
    const recommendationDescription = canvasElement.querySelector(
      ".clv-hub-conversation-inspection__recommendation-description",
    );
    const reviewAction = canvas.getByRole("button", { name: "Revisar recomendação" });

    if (
      !(recommendation instanceof HTMLElement) ||
      !(recommendationContent instanceof HTMLElement) ||
      !(recommendationDescription instanceof HTMLElement)
    ) {
      throw new Error("O conteúdo e a ação da recomendação devem estar presentes.");
    }

    const recommendationBounds = recommendation.getBoundingClientRect();
    const recommendationContentBounds = recommendationContent.getBoundingClientRect();
    const reviewActionBounds = reviewAction.getBoundingClientRect();

    await expect(recommendationContentBounds.width).toBeCloseTo(recommendationBounds.width, 0);
    await expect(getComputedStyle(recommendationDescription).maxInlineSize).toBe("768px");
    await expect(reviewActionBounds.top).toBeGreaterThan(recommendationContentBounds.bottom);
    await expect(reviewAction).toHaveClass("clv-button--size-sm");
  },
};

export const Interacoes: Story = {
  ...Sucesso,
  name: "Interações críticas",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole("searchbox", { name: "Buscar conversa" });

    await userEvent.type(search, "004");
    await expect(canvas.getByRole("rowheader", { name: "Contato 004" })).toBeVisible();
    await expect(canvas.queryByRole("rowheader", { name: "Contato 012" })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Limpar busca" }));

    await userEvent.click(canvas.getByRole("button", { name: "Revisão" }));
    await expect(canvas.getByRole("rowheader", { name: "Contato 004" })).toBeVisible();
    await expect(canvas.queryByRole("rowheader", { name: "Contato 021" })).not.toBeInTheDocument();

    const body = within(canvasElement.ownerDocument.body);
    const advancedTrigger = canvas.getByRole("button", { name: "Filtros" });
    await userEvent.click(advancedTrigger);
    const advanced = await body.findByRole("dialog", { name: "Filtros de conversas" });
    await userEvent.click(within(advanced).getByRole("button", { name: /Origem/ }));
    await userEvent.click(await body.findByRole("option", { name: "Indicação" }));
    await userEvent.click(within(advanced).getByRole("button", { name: "Fechar" }));
    await waitFor(() => expect(advancedTrigger).toHaveFocus());
    await expect(canvas.getByText("1 filtro aplicado · 1 resultado")).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Limpar filtros" }));
    await expect(canvas.queryByRole("button", { name: "Limpar filtros" })).not.toBeInTheDocument();

    await userEvent.click(advancedTrigger);
    const appliedPanel = await body.findByRole("dialog", { name: "Filtros de conversas" });
    await userEvent.click(within(appliedPanel).getByRole("button", { name: /Origem/ }));
    await userEvent.click(await body.findByRole("option", { name: "Campanha" }));
    await userEvent.click(within(appliedPanel).getByRole("button", { name: "Aplicar filtros" }));
    await expect(canvas.getByRole("rowheader", { name: "Contato 012" })).toBeVisible();
    await expect(canvas.getByText("1 filtro aplicado · 1 resultado")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Limpar filtros" }));

    await userEvent.click(canvas.getByRole("rowheader", { name: "Contato 004" }));
    await expect(canvas.getByText("Seleção atual: Contato 004.")).toBeVisible();

    const reviewAction = canvas.getByRole("button", { name: "Revisar recomendação" });
    await expect(reviewAction).toHaveClass("clv-button--size-sm");
    await userEvent.click(reviewAction);
    await expect(
      canvas.getByText("Recomendação marcada para revisão nesta demonstração."),
    ).toBeVisible();
    await expect(canvas.getByText("Em revisão")).toBeVisible();

    const trigger = canvas.getByRole("button", { name: "Executar nova análise" });
    await userEvent.click(trigger);
    await waitFor(() =>
      expect(body.getByRole("dialog", { name: "Executar nova análise" })).toBeVisible(),
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
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
    const retry = within(canvasElement).getByRole("button", { name: "Tentar novamente" });
    retry.focus();
    await expect(retry).toHaveFocus();
  },
};
