"use client";

import { CheckIcon, ChevronRightIcon, ChevronUpIcon } from "@clavia-ds/icons";
import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Cell as AriaCell,
  type CellProps as AriaCellProps,
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
  Collection as AriaCollection,
  Column as AriaColumn,
  type ColumnProps as AriaColumnProps,
  Row as AriaRow,
  type RowProps as AriaRowProps,
  Table as AriaTable,
  TableBody as AriaTableBody,
  type TableBodyProps as AriaTableBodyProps,
  TableHeader as AriaTableHeader,
  type TableHeaderProps as AriaTableHeaderProps,
  type TableProps as AriaTableProps,
} from "react-aria-components";

export type TableVariant = "surface" | "plain";
export type TableSortDirection = "ascending" | "descending";
export type TableFeedbackState = "empty" | "loading" | "error" | "unavailable";

export interface TableSortDescriptor {
  column: number | string;
  direction: TableSortDirection;
}

export interface TableProps extends Omit<HTMLAttributes<HTMLDivElement>, "className"> {
  className?: string;
  variant?: TableVariant;
}

export interface TableScrollContainerProps extends Omit<HTMLAttributes<HTMLElement>, "className"> {
  /** Nomeia a região focável que permite rolar tabelas largas pelo teclado. */
  className?: string;
  scrollLabel?: string;
}

export interface TableContentProps
  extends Omit<
    AriaTableProps,
    "aria-label" | "className" | "onSortChange" | "sortDescriptor" | "style"
  > {
  className?: string;
  label: string;
  minWidth?: CSSProperties["minWidth"];
  onSortChange?: (descriptor: TableSortDescriptor) => void;
  sortDescriptor?: TableSortDescriptor;
  style?: CSSProperties;
}

export type TableHeaderProps<T extends object> = Omit<AriaTableHeaderProps<T>, "className"> & {
  className?: string;
};

export interface TableColumnProps extends Omit<AriaColumnProps, "className"> {
  className?: string;
}

export type TableBodyProps<T extends object> = Omit<AriaTableBodyProps<T>, "className"> & {
  className?: string;
};

export type TableRowProps<T extends object> = Omit<AriaRowProps<T>, "className"> & {
  className?: string;
};

export interface TableCellProps extends Omit<AriaCellProps, "className"> {
  className?: string;
}

export interface TableSortableColumnHeaderProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "className" | "children"> {
  children?: ReactNode;
  className?: string;
  indicator?: ReactNode;
  showIndicator?: boolean;
  sortDirection?: TableSortDirection | undefined;
}

export interface TableSelectionCheckboxProps
  extends Omit<AriaCheckboxProps, "children" | "className" | "slot"> {
  className?: string;
}

export interface TableSelectionRadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type"> {
  className?: string;
}

export interface TableExpandButtonProps
  extends Omit<AriaButtonProps, "children" | "className" | "slot"> {
  children?: ReactNode;
  className?: string;
}

export interface TableFooterProps extends Omit<HTMLAttributes<HTMLDivElement>, "className"> {
  className?: string;
}

export interface TableEmptyStateProps {
  action?: ReactNode;
  description?: ReactNode;
  state?: TableFeedbackState;
  title: ReactNode;
}

export interface TableStatusProps {
  action?: ReactNode;
  description?: ReactNode;
  state: Exclude<TableFeedbackState, "empty">;
  title: ReactNode;
}

function mergeClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function TableRoot({ className, variant = "surface", ...props }: TableProps) {
  return (
    <div {...props} className={mergeClasses("clv-table", `clv-table--${variant}`, className)} />
  );
}

function TableScrollContainer({
  className,
  scrollLabel = "Área de rolagem horizontal da tabela",
  tabIndex = 0,
  ...props
}: TableScrollContainerProps) {
  return (
    <section
      {...props}
      aria-label={scrollLabel}
      className={mergeClasses("clv-table__scroll-container", className)}
      tabIndex={tabIndex}
    />
  );
}

function TableContent({ className, label, minWidth, style, ...props }: TableContentProps) {
  const contentStyle = minWidth === undefined ? style : { ...style, minWidth };

  return (
    <AriaTable
      {...props}
      aria-label={label}
      className={mergeClasses("clv-table__content", className)}
      {...(contentStyle ? { style: contentStyle } : {})}
    />
  );
}

function TableHeader<T extends object>({ className, ...props }: TableHeaderProps<T>) {
  return <AriaTableHeader {...props} className={mergeClasses("clv-table__header", className)} />;
}

function TableColumn({ className, ...props }: TableColumnProps) {
  return <AriaColumn {...props} className={mergeClasses("clv-table__column", className)} />;
}

function TableBody<T extends object>({ className, ...props }: TableBodyProps<T>) {
  return <AriaTableBody {...props} className={mergeClasses("clv-table__body", className)} />;
}

function TableRow<T extends object>({ className, ...props }: TableRowProps<T>) {
  return <AriaRow {...props} className={mergeClasses("clv-table__row", className)} />;
}

function TableCell({ className, ...props }: TableCellProps) {
  return <AriaCell {...props} className={mergeClasses("clv-table__cell", className)} />;
}

function TableSortableColumnHeader({
  children,
  className,
  indicator,
  showIndicator = true,
  sortDirection,
  ...props
}: TableSortableColumnHeaderProps) {
  const indicatorContent = indicator ?? <ChevronUpIcon />;

  return (
    <span
      {...props}
      className={mergeClasses("clv-table__sortable-column-header", className)}
      data-direction={sortDirection}
    >
      {children}
      {showIndicator && sortDirection ? (
        <span
          aria-hidden="true"
          className="clv-table__sortable-column-indicator"
          data-direction={sortDirection}
        >
          {indicatorContent}
        </span>
      ) : null}
    </span>
  );
}

function TableSelectionCheckbox({
  "aria-label": ariaLabel = "Selecionar linha",
  className,
  ...props
}: TableSelectionCheckboxProps) {
  return (
    <AriaCheckbox
      {...props}
      aria-label={ariaLabel}
      className={mergeClasses("clv-table__selection-checkbox", className)}
      slot="selection"
    >
      {({ isIndeterminate, isSelected }) => (
        <span
          aria-hidden="true"
          className="clv-table__selection-checkbox-control"
          data-indeterminate={isIndeterminate || undefined}
          data-selected={isSelected || undefined}
        >
          {isIndeterminate ? <span className="clv-table__selection-checkbox-indicator" /> : null}
          {isSelected ? <CheckIcon className="clv-table__selection-checkbox-icon" /> : null}
        </span>
      )}
    </AriaCheckbox>
  );
}

function TableSelectionRadio({ className, ...props }: TableSelectionRadioProps) {
  return (
    <label className={mergeClasses("clv-table__selection-radio", className)}>
      <input {...props} className="clv-table__selection-radio-input" type="radio" />
      <span aria-hidden="true" className="clv-table__selection-radio-control" />
    </label>
  );
}

function TableExpandButton({
  "aria-label": ariaLabel = "Mostrar ou ocultar itens",
  children,
  className,
  ...props
}: TableExpandButtonProps) {
  return (
    <AriaButton
      {...props}
      aria-label={ariaLabel}
      className={mergeClasses("clv-table__expand-button", className)}
      slot="chevron"
    >
      {children ?? <ChevronRightIcon aria-hidden="true" />}
    </AriaButton>
  );
}

function TableFooter({ className, ...props }: TableFooterProps) {
  return <div {...props} className={mergeClasses("clv-table__footer", className)} />;
}

function TableEmptyState({ action, description, state = "empty", title }: TableEmptyStateProps) {
  const role = state === "error" || state === "unavailable" ? "alert" : "status";

  return (
    <div
      aria-live={state === "loading" ? "polite" : undefined}
      className="clv-table__empty-state"
      data-state={state}
      role={role}
    >
      <strong>{title}</strong>
      {description ? <span>{description}</span> : null}
      {action ? <div className="clv-table__empty-state-action">{action}</div> : null}
    </div>
  );
}

function TableStatus({ action, description, state, title }: TableStatusProps) {
  return (
    <div
      aria-live={state === "loading" ? "polite" : undefined}
      className="clv-table__status"
      data-state={state}
      role={state === "error" || state === "unavailable" ? "alert" : "status"}
    >
      <strong>{title}</strong>
      {description ? <span>{description}</span> : null}
      {action ? <div className="clv-table__status-action">{action}</div> : null}
    </div>
  );
}

const TableCollection = AriaCollection;

export const Table = Object.assign(TableRoot, {
  Body: TableBody,
  Cell: TableCell,
  Column: TableColumn,
  Collection: TableCollection,
  Content: TableContent,
  EmptyState: TableEmptyState,
  Footer: TableFooter,
  Header: TableHeader,
  Row: TableRow,
  ScrollContainer: TableScrollContainer,
  SelectionCheckbox: TableSelectionCheckbox,
  SelectionRadio: TableSelectionRadio,
  Status: TableStatus,
  SortableColumnHeader: TableSortableColumnHeader,
  ExpandButton: TableExpandButton,
});
