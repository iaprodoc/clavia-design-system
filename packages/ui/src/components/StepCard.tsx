import { ChevronRightIcon } from "@clavia-ds/icons";
import type { MouseEventHandler, ReactNode } from "react";

import { StatusBadge } from "./StatusBadge";
import type { StepStatus } from "./Stepper";

export interface StepCardProps {
  description: ReactNode;
  disabled?: boolean;
  /** Ícone contextual que identifica a etapa e permanece consistente em todos os estados. */
  leadingIcon: ReactNode;
  number: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  status: StepStatus;
  title: ReactNode;
}

const statusLabel: Record<StepStatus, string> = {
  available: "Disponível",
  blocked: "Bloqueada",
  completed: "Concluída",
  current: "Em andamento",
};

export function StepCard({
  description,
  disabled = false,
  leadingIcon,
  number,
  onClick,
  status,
  title,
}: StepCardProps) {
  const isDisabled = disabled || status === "blocked";
  const isInteractive = Boolean(onClick) && !isDisabled;
  const content = (
    <span className="clv-step-card__layout">
      <span aria-hidden="true" className="clv-step-card__indicator">
        {leadingIcon}
      </span>
      <span className="clv-step-card__body">
        <span className="clv-sr-only">
          Etapa {number}. Status: {statusLabel[status]}.
        </span>
        <span className="clv-step-card__heading">
          <span className="clv-step-card__title">{title}</span>
          {status === "completed" ? (
            <span aria-hidden="true" className="clv-step-card__status">
              <StatusBadge size="xs" status="success" variant="soft">
                Concluída
              </StatusBadge>
            </span>
          ) : null}
        </span>
        <span className="clv-step-card__description">{description}</span>
      </span>
      {isInteractive ? (
        <span aria-hidden="true" className="clv-step-card__chevron">
          <ChevronRightIcon />
        </span>
      ) : null}
    </span>
  );
  const classes = [
    "clv-step-card",
    `clv-step-card--${status}`,
    isInteractive ? "clv-step-card--interactive" : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  if (onClick) {
    return (
      <button
        aria-current={status === "current" ? "step" : undefined}
        className={classes}
        disabled={isDisabled}
        onClick={onClick}
        type="button"
      >
        {content}
      </button>
    );
  }

  return <article className={classes}>{content}</article>;
}
