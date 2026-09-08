import { ChevronLeftIcon, ChevronRightIcon, DotsThreeIcon } from "@clavia-ds/icons";
import type { ReactNode } from "react";

import { DropdownMenu, type DropdownMenuItem } from "./DropdownMenu";
import { Table, type TableSortDescriptor } from "./Table";

export interface DataTableColumn<T> {
  allowsSorting?: boolean;
  id: string;
  isRowHeader?: boolean;
  label: ReactNode;
  render: (row: T) => ReactNode;
}

export interface DataTablePagination {
  currentPage: number;
  onPageChange: (page: number) => void;
  pageCount: number;
}

export interface DataTableAction<T> extends Omit<DropdownMenuItem, "onAction"> {
  onAction?: (row: T) => void;
}

export type DataTableActionsVariant = "direct" | "overflow";

export type DataTableState = "idle" | "loading" | "error" | "unavailable";

export interface DataTableProps<T extends object> {
  actionMenu?: (row: T) => readonly DataTableAction<T>[];
  actionMenuLabel?: (row: T) => string;
  actions?: (row: T) => ReactNode;
  actionsVariant?: DataTableActionsVariant;
  columns: readonly DataTableColumn<T>[];
  emptyDescription?: string;
  emptyTitle?: string;
  errorDescription?: string;
  errorTitle?: string;
  getRowId: (row: T) => string | number;
  label: string;
  loading?: boolean;
  minWidth?: string;
  onSelectionChange?: (keys: "all" | Set<string | number>) => void;
  onRetry?: () => void;
  onSortChange?: (descriptor: TableSortDescriptor) => void;
  pagination?: DataTablePagination;
  rows: readonly T[];
  selectedKeys?: "all" | Iterable<string | number>;
  selectionMode?: "multiple" | "single";
  sortDescriptor?: TableSortDescriptor;
  state?: DataTableState;
  unavailableDescription?: string;
  unavailableTitle?: string;
}

export function DataTable<T extends object>({
  actionMenu,
  actionMenuLabel,
  actions,
  actionsVariant = "direct",
  columns,
  emptyDescription = "Revise a busca ou remova os filtros aplicados.",
  emptyTitle = "Nenhum resultado encontrado",
  errorDescription = "Não foi possível carregar estes registros. Tente novamente.",
  errorTitle = "Não foi possível carregar os resultados",
  getRowId,
  label,
  loading = false,
  minWidth,
  onSelectionChange,
  onRetry,
  onSortChange,
  pagination,
  rows,
  selectedKeys,
  selectionMode,
  sortDescriptor,
  state = "idle",
  unavailableDescription = "Esta área está temporariamente indisponível. Tente novamente mais tarde.",
  unavailableTitle = "Resultados indisponíveis",
}: DataTableProps<T>) {
  const hasActions = Boolean(actions || actionMenu);
  const hasOverflowActions = Boolean(actionMenu);
  const hasDirectActions = Boolean(actions);
  const hasOverflowOnlyActions = hasOverflowActions && !hasDirectActions;
  const getActionMenuLabel = actionMenuLabel ?? ((row: T) => `Ações para ${getRowId(row)}`);
  const hasSelectionCheckboxes = selectionMode === "multiple";
  const dataState: DataTableState = loading ? "loading" : state;
  const activeState: Exclude<DataTableState, "idle"> | null =
    dataState === "idle" ? null : dataState;
  const pageCount = pagination ? Math.max(1, Math.floor(pagination.pageCount)) : 0;
  const currentPage = pagination
    ? Math.min(Math.max(1, Math.floor(pagination.currentPage)), pageCount)
    : 0;
  const canGoBack = pagination ? currentPage > 1 : false;
  const canGoForward = pagination ? currentPage < pageCount : false;
  const retryAction = onRetry ? (
    <button className="clv-table__status-action-button" onClick={onRetry} type="button">
      Tentar novamente
    </button>
  ) : null;

  const stateCopy = {
    error: { description: errorDescription, title: errorTitle },
    loading: { description: null, title: "Atualizando dados" },
    unavailable: { description: unavailableDescription, title: unavailableTitle },
  } as const;
  const currentStateCopy = activeState ? stateCopy[activeState] : null;
  const tableState = rows.length === 0 && activeState ? activeState : "empty";

  return (
    <Table
      aria-busy={dataState === "loading" || undefined}
      className="clv-data-table"
      data-state={dataState}
    >
      {rows.length > 0 && activeState && currentStateCopy ? (
        <Table.Status
          action={activeState === "error" || activeState === "unavailable" ? retryAction : null}
          description={currentStateCopy.description}
          state={activeState}
          title={currentStateCopy.title}
        />
      ) : null}
      <Table.ScrollContainer aria-busy={dataState === "loading" || undefined}>
        <Table.Content
          aria-busy={dataState === "loading" || undefined}
          label={label}
          minWidth={minWidth}
          {...(onSelectionChange ? { onSelectionChange } : {})}
          {...(onSortChange ? { onSortChange } : {})}
          {...(selectedKeys !== undefined ? { selectedKeys } : {})}
          {...(selectionMode ? { selectionMode } : {})}
          {...(sortDescriptor !== undefined ? { sortDescriptor } : {})}
        >
          <Table.Header>
            {hasSelectionCheckboxes ? (
              <Table.Column className="clv-table__selection-column" id="selection">
                <Table.SelectionCheckbox aria-label="Selecionar todas as linhas" />
              </Table.Column>
            ) : null}
            {columns.map((column) => (
              <Table.Column
                id={column.id}
                key={column.id}
                {...(column.allowsSorting ? { allowsSorting: true } : {})}
                {...(column.isRowHeader ? { isRowHeader: true } : {})}
              >
                {column.allowsSorting
                  ? ({ sortDirection }) => (
                      <Table.SortableColumnHeader sortDirection={sortDirection}>
                        {column.label}
                      </Table.SortableColumnHeader>
                    )
                  : column.label}
              </Table.Column>
            ))}
            {hasActions ? (
              <Table.Column className="clv-data-table__actions-column" id="actions">
                {hasOverflowOnlyActions && actionsVariant === "overflow" ? "Opções" : "Ações"}
              </Table.Column>
            ) : null}
          </Table.Header>
          <Table.Body
            renderEmptyState={() => (
              <Table.EmptyState
                action={tableState === "error" || tableState === "unavailable" ? retryAction : null}
                description={
                  tableState === "empty" ? emptyDescription : stateCopy[tableState].description
                }
                state={tableState}
                title={tableState === "empty" ? emptyTitle : stateCopy[tableState].title}
              />
            )}
          >
            {rows.map((row) => (
              <Table.Row id={getRowId(row)} key={getRowId(row)}>
                {hasSelectionCheckboxes ? (
                  <Table.Cell className="clv-table__selection-cell">
                    <Table.SelectionCheckbox aria-label={`Selecionar linha ${getRowId(row)}`} />
                  </Table.Cell>
                ) : null}
                {columns.map((column) => (
                  <Table.Cell key={column.id}>{column.render(row)}</Table.Cell>
                ))}
                {hasActions ? (
                  <Table.Cell className="clv-data-table__actions-cell">
                    <span className="clv-data-table__actions-content">
                      {actions?.(row)}
                      {hasOverflowActions ? (
                        <DropdownMenu
                          items={(actionMenu?.(row) ?? []).map(({ onAction, ...item }) => ({
                            ...item,
                            ...(onAction ? { onAction: () => onAction(row) } : {}),
                          }))}
                          label={getActionMenuLabel(row)}
                          trigger={<DotsThreeIcon aria-hidden="true" />}
                          triggerLabel={getActionMenuLabel(row)}
                          triggerVariant="overflow"
                        />
                      ) : null}
                    </span>
                  </Table.Cell>
                ) : null}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      {pagination ? (
        <Table.Footer>
          <span>
            Página {currentPage} de {pageCount}
          </span>
          <span className="clv-data-table__pagination">
            <button
              aria-label="Página anterior"
              disabled={!canGoBack}
              onClick={() => pagination.onPageChange(currentPage - 1)}
              type="button"
            >
              <ChevronLeftIcon aria-hidden="true" />
            </button>
            <button
              aria-label="Próxima página"
              disabled={!canGoForward}
              onClick={() => pagination.onPageChange(currentPage + 1)}
              type="button"
            >
              <ChevronRightIcon aria-hidden="true" />
            </button>
          </span>
        </Table.Footer>
      ) : null}
    </Table>
  );
}
