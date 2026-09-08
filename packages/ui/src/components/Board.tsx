import { CalendarIcon, PlusIcon } from "@clavia-ds/icons";
import { type ReactNode, useId } from "react";

import { Avatar } from "./Avatar";
import { Button, type ButtonProps } from "./Button";
import { Progress } from "./Progress";
import { Skeleton } from "./Skeleton";
import { StatusBadge, type StatusBadgeProps } from "./StatusBadge";

export interface BoardProps {
  /** Columns representing the ordered stages of a workflow. */
  children: ReactNode;
  /** Accessible name for the board work region. */
  label: string;
}

/**
 * A horizontally scrollable structural board for ordered work. It does not own
 * persistence, drag-and-drop, stage transitions, routing, or business rules.
 */
export function Board({ children, label }: BoardProps) {
  return (
    <div className="clv-board">
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: The overflow region must receive keyboard focus. */}
      <section aria-label={label} className="clv-board__scroll" tabIndex={0}>
        <div className="clv-board__columns">{children}</div>
      </section>
    </div>
  );
}

export type BoardMarkerTone = "info" | "neutral" | "success" | "warning";

export interface BoardColumnProps {
  addCardLabel?: string;
  children?: ReactNode;
  count: number;
  isLoading?: boolean;
  markerTone?: BoardMarkerTone;
  onAddCard?: () => void;
  summary?: ReactNode;
  title: string;
}

/** A neutral workflow lane; its contents, ordering and transitions remain consumer-owned. */
export function BoardColumn({
  addCardLabel = "Adicionar novo card",
  children,
  count,
  isLoading = false,
  markerTone = "neutral",
  onAddCard,
  summary,
  title,
}: BoardColumnProps) {
  const titleId = useId();
  const isEmpty = !isLoading && !children;

  return (
    <section aria-labelledby={titleId} className="clv-board-column">
      <header className="clv-board-column__header">
        <div className="clv-board-column__heading">
          <span aria-hidden="true" className="clv-board-column__marker" data-tone={markerTone} />
          <div>
            <h2 id={titleId}>{title}</h2>
            {summary ? <p className="clv-board-column__summary">{summary}</p> : null}
          </div>
        </div>
        <div className="clv-board-column__actions">
          <span className="clv-board-column__count">
            <span aria-hidden="true">{count}</span>
            <span className="clv-sr-only">
              {count} {count === 1 ? "item" : "itens"}
            </span>
          </span>
          {onAddCard ? (
            <button
              aria-label={`Adicionar card a ${title}`}
              className="clv-board-column__add"
              onClick={onAddCard}
              type="button"
            >
              <PlusIcon aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </header>
      <div aria-busy={isLoading || undefined} className="clv-board-column__content">
        {isLoading ? <ColumnLoading title={title} /> : null}
        {isEmpty ? <p className="clv-board-column__empty">Nenhum item nesta etapa.</p> : null}
        {children}
      </div>
      {!isLoading && onAddCard ? (
        <BoardAddCardButton
          aria-label={`${addCardLabel} a ${title}`}
          label={addCardLabel}
          onClick={onAddCard}
        />
      ) : null}
    </section>
  );
}

function ColumnLoading({ title }: { title: string }) {
  return (
    <div
      aria-label={`Carregando itens de ${title}`}
      className="clv-board-column__loading"
      role="status"
    >
      <Skeleton height="5rem" motion="none" shape="rectangle" />
      <Skeleton height="5rem" motion="none" shape="rectangle" />
      <span className="clv-sr-only">Carregando itens de {title}</span>
    </div>
  );
}

export interface BoardCardProps {
  action?: ReactNode;
  assignee?: { name: string };
  context?: ReactNode;
  isOverdue?: boolean;
  metadata?: ReactNode;
  onOpen?: () => void;
  progress?: { label: string; value: number };
  status?: Pick<StatusBadgeProps, "children" | "status" | "variant">;
  title: string;
}

/** A compact item within a BoardColumn, with a consumer-owned primary action. */
export function BoardCard({
  action,
  assignee,
  context,
  isOverdue = false,
  metadata,
  onOpen,
  progress,
  status,
  title,
}: BoardCardProps) {
  const titleId = useId();

  return (
    <article
      aria-labelledby={titleId}
      className="clv-board-card"
      data-overdue={isOverdue || undefined}
    >
      <div className="clv-board-card__body">
        {context || assignee ? (
          <div className="clv-board-card__topline">
            {context ? <p className="clv-board-card__context">{context}</p> : <span />}
            {assignee ? <Avatar name={assignee.name} size="sm" /> : null}
          </div>
        ) : null}
        {onOpen ? (
          <button className="clv-board-card__open" id={titleId} onClick={onOpen} type="button">
            {title}
          </button>
        ) : (
          <h3 id={titleId}>{title}</h3>
        )}
        {progress ? <Progress label={progress.label} value={progress.value} /> : null}
      </div>
      {metadata || status || action ? (
        <footer className="clv-board-card__footer">
          <div className="clv-board-card__footer-info">
            {status ? (
              <div className="clv-board-card__status">
                <StatusBadge
                  size="xs"
                  status={status.status ?? "neutral"}
                  variant={status.variant ?? "outline"}
                >
                  {status.children}
                </StatusBadge>
              </div>
            ) : null}
            {metadata ? <div className="clv-board-card__metadata">{metadata}</div> : null}
          </div>
          {action ? <div className="clv-board-card__actions">{action}</div> : null}
        </footer>
      ) : null}
    </article>
  );
}

export interface BoardAddCardButtonProps
  extends Omit<
    ButtonProps,
    "children" | "fullWidth" | "isIconOnly" | "leadingIcon" | "size" | "trailingIcon" | "variant"
  > {
  label?: string;
}

/** Full-width, subordinate action for adding an item to a BoardColumn. */
export function BoardAddCardButton({
  className,
  label = "Adicionar novo card",
  type = "button",
  ...props
}: BoardAddCardButtonProps) {
  const classes = ["clv-board-add-card-button", className].filter(Boolean).join(" ");

  return (
    <Button
      {...props}
      className={classes}
      fullWidth
      leadingIcon={<PlusIcon />}
      size="sm"
      type={type}
      variant="surface"
    >
      {label}
    </Button>
  );
}

export interface BoardCardDateProps {
  /** ISO calendar date in YYYY-MM-DD format. */
  date: string;
  locale?: string;
}

/** Compact, localized date metadata for a BoardCard. */
export function BoardCardDate({ date, locale = "pt-BR" }: BoardCardDateProps) {
  const value = new Date(`${date}T12:00:00.000Z`);
  const shortParts = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).formatToParts(value);
  const day = shortParts.find(({ type }) => type === "day")?.value ?? "";
  const month = (shortParts.find(({ type }) => type === "month")?.value ?? "").replace(/\.$/u, "");
  const accessibleDate = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(value);

  return (
    <time className="clv-board-card-date" dateTime={date} lang={locale} title={accessibleDate}>
      <CalendarIcon aria-hidden="true" />
      <span aria-hidden="true">
        {month} {day}
      </span>
      <span className="clv-sr-only">{accessibleDate}</span>
    </time>
  );
}
