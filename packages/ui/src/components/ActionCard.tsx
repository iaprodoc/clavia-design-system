import type { ReactNode } from "react";

export interface ActionCardProps {
  actionLabel?: string;
  description?: ReactNode;
  disabled?: boolean;
  leadingIcon?: ReactNode;
  onAction: () => void;
  title: string;
}

/** Uma ação isolada e importante; não use para exibir métricas ou navegar entre páginas. */
export function ActionCard({
  actionLabel = "Abrir",
  description,
  disabled = false,
  leadingIcon,
  onAction,
  title,
}: ActionCardProps) {
  return (
    <button className="clv-action-card" disabled={disabled} onClick={onAction} type="button">
      {leadingIcon ? (
        <span aria-hidden="true" className="clv-action-card__icon">
          {leadingIcon}
        </span>
      ) : null}
      <span className="clv-action-card__content">
        <span className="clv-action-card__title">{title}</span>
        {description ? <span className="clv-action-card__description">{description}</span> : null}
      </span>
      <span className="clv-action-card__label">{actionLabel}</span>
    </button>
  );
}
