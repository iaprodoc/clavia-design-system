"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";
import { Dialog, type DialogProps } from "./Dialog";

export interface FilterDialogProps
  extends Omit<
    DialogProps,
    "actions" | "children" | "showCloseButton" | "title" | "trigger" | "variant"
  > {
  /** Quantidade de critérios já aplicados, exibida no gatilho. */
  activeFilterCount?: number;
  applyLabel?: string;
  children: ReactNode;
  clearLabel?: string;
  isApplyDisabled?: boolean;
  onApply?: () => void;
  onClear?: () => void;
  title?: string;
  trigger?: ReactNode;
}

export interface FilterDialogGroupProps {
  children: ReactNode;
  label?: ReactNode;
}

export interface FilterDialogRowProps {
  children: ReactNode;
  icon?: ReactNode;
  label: ReactNode;
}

/**
 * Painel modal para filtros detalhados. Complementa — e não substitui — os
 * filtros rápidos em `ToggleGroup` ou `FilterBar`.
 */
export function FilterDialog({
  activeFilterCount = 0,
  applyLabel = "Aplicar filtros",
  children,
  clearLabel = "Limpar filtros",
  isApplyDisabled = false,
  onApply,
  onClear,
  title = "Filtros",
  trigger,
  triggerVariant = "secondary",
  ...dialogProps
}: FilterDialogProps) {
  const triggerContent = trigger ?? (
    <span className="clv-filter-dialog__trigger-content">
      <span>Filtros</span>
      {activeFilterCount > 0 ? (
        <>
          <span aria-hidden="true" className="clv-filter-dialog__count">
            {activeFilterCount}
          </span>
          <span className="clv-sr-only">
            {activeFilterCount} {activeFilterCount === 1 ? "filtro aplicado" : "filtros aplicados"}
          </span>
        </>
      ) : null}
    </span>
  );

  return (
    <Dialog
      {...dialogProps}
      actions={
        <>
          {onClear ? (
            <Button onClick={onClear} size="xs" variant="text">
              {clearLabel}
            </Button>
          ) : null}
          {onApply ? (
            <Button disabled={isApplyDisabled} onClick={onApply} size="xs">
              {applyLabel}
            </Button>
          ) : null}
        </>
      }
      showCloseButton
      title={title}
      trigger={triggerContent}
      triggerVariant={triggerVariant}
      variant="filter"
    >
      <div className="clv-filter-dialog__body">{children}</div>
    </Dialog>
  );
}

export function FilterDialogGroup({ children, label }: FilterDialogGroupProps) {
  return (
    <section className="clv-filter-dialog__group">
      {label ? <h3 className="clv-filter-dialog__group-label">{label}</h3> : null}
      <div className="clv-filter-dialog__group-content">{children}</div>
    </section>
  );
}

export function FilterDialogRow({ children, icon, label }: FilterDialogRowProps) {
  return (
    <div className="clv-filter-dialog__row">
      <div className="clv-filter-dialog__row-label">
        {icon ? (
          <span aria-hidden="true" className="clv-filter-dialog__row-icon">
            {icon}
          </span>
        ) : null}
        <span>{label}</span>
      </div>
      <div className="clv-filter-dialog__row-control">{children}</div>
    </div>
  );
}
