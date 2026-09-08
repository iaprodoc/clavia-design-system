import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  XIcon,
} from "@clavia-ds/icons";
import { type ReactNode, useId } from "react";

export type ToastStatus = "danger" | "info" | "success" | "warning";

export interface ToastProps {
  action?: ReactNode;
  description?: ReactNode;
  dismissLabel?: string;
  onDismiss?: () => void;
  status?: ToastStatus;
  title: string;
}

const iconByStatus: Record<ToastStatus, ReactNode> = {
  danger: <CircleAlertIcon />,
  info: <InfoIcon />,
  success: <CircleCheckIcon />,
  warning: <TriangleAlertIcon />,
};

/**
 * Confirma uma mudança breve fora do conteúdo afetado. A fila, a duração e a
 * decisão de exibição pertencem ao produto que a utiliza.
 */
export function Toast({
  action,
  description,
  dismissLabel = "Fechar notificação",
  onDismiss,
  status = "success",
  title,
}: ToastProps) {
  const titleId = useId();
  const descriptionId = useId();
  const role = status === "danger" || status === "warning" ? "alert" : "status";

  return (
    <section
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={titleId}
      className={`clv-toast clv-toast--${status}`}
      data-status={status}
      role={role}
    >
      <span aria-hidden="true" className="clv-toast__icon">
        {iconByStatus[status]}
      </span>
      <div className="clv-toast__content">
        <strong id={titleId}>{title}</strong>
        {description ? <p id={descriptionId}>{description}</p> : null}
      </div>
      {action ? <div className="clv-toast__action">{action}</div> : null}
      {onDismiss ? (
        <button
          aria-label={dismissLabel}
          className="clv-toast__dismiss"
          onClick={onDismiss}
          type="button"
        >
          <XIcon aria-hidden="true" />
        </button>
      ) : null}
    </section>
  );
}
