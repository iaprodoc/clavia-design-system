import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from "@clavia-ds/icons";
import { type ReactNode, useId } from "react";
import { CloseButton } from "./CloseButton";

export type AlertStatus = "info" | "success" | "warning" | "danger";
export type AlertSize = "sm" | "md";
export type AlertVariant = "inline" | "featured";

export interface AlertProps {
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  dismissLabel?: string;
  metadata?: ReactNode;
  onDismiss?: () => void;
  role?: "alert" | "status";
  size?: AlertSize;
  status?: AlertStatus;
  title?: string;
  variant?: AlertVariant;
}

const iconByStatus: Record<AlertStatus, ReactNode> = {
  danger: <CircleAlertIcon />,
  info: <InfoIcon />,
  success: <CircleCheckIcon />,
  warning: <TriangleAlertIcon />,
};

/**
 * Comunica uma informação contextual que precisa permanecer visível perto do conteúdo afetado.
 * Para uma confirmação transitória, use Toast; para salvar alterações, use SaveStatus.
 */
export function Alert({
  actions,
  children,
  className,
  dismissLabel = "Fechar alerta",
  metadata,
  onDismiss,
  role: roleProp,
  size = "md",
  status = "info",
  title,
  variant = "inline",
}: AlertProps) {
  const titleId = useId();
  const messageId = useId();
  const classes = [
    "clv-alert",
    `clv-alert--${status}`,
    `clv-alert--size-${size}`,
    `clv-alert--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const role = roleProp ?? (status === "info" || status === "success" ? "status" : "alert");
  const hasFooter = variant === "featured" && (metadata || actions);
  const hasMessage = children !== undefined && children !== null && children !== "";
  const icon = (
    <span aria-hidden="true" className="clv-alert__icon">
      {iconByStatus[status]}
    </span>
  );
  const content = (
    <div className="clv-alert__content">
      {title ? <strong id={titleId}>{title}</strong> : null}
      {hasMessage ? (
        <div className="clv-alert__message" id={messageId}>
          {children}
        </div>
      ) : null}
    </div>
  );

  if (variant === "inline") {
    return (
      <section
        aria-describedby={hasMessage ? messageId : undefined}
        aria-labelledby={title ? titleId : undefined}
        className={classes}
        data-status={status}
        role={role}
      >
        {icon}
        {content}
        {actions ? <div className="clv-alert__actions">{actions}</div> : null}
        {onDismiss ? <CloseButton label={dismissLabel} onClick={onDismiss} size="xs" /> : null}
      </section>
    );
  }

  return (
    <section
      aria-describedby={hasMessage ? messageId : undefined}
      aria-labelledby={title ? titleId : undefined}
      className={classes}
      data-status={status}
      role={role}
    >
      {variant === "featured" ? <span aria-hidden="true" className="clv-alert__aura" /> : null}
      <div className="clv-alert__main">
        <div className="clv-alert__header">
          {icon}
          {onDismiss ? <CloseButton label={dismissLabel} onClick={onDismiss} /> : null}
        </div>
        {content}
      </div>
      {hasFooter ? (
        <div className="clv-alert__footer">
          {metadata ? <div className="clv-alert__metadata">{metadata}</div> : null}
          {actions ? <div className="clv-alert__actions">{actions}</div> : null}
        </div>
      ) : null}
    </section>
  );
}
