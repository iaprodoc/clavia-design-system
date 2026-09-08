import type { ReactNode } from "react";
import { Alert } from "./Alert";

export type OperationalAlertSeverity = "danger" | "info" | "warning";
export type OperationalAlertVariant = "featured" | "inline";
export interface OperationalAlertProps {
  /** Próximas ações disponíveis para resolver ou investigar a ocorrência. */
  actions: ReactNode;
  children?: ReactNode;
  details?: ReactNode;
  impact?: string;
  severity?: OperationalAlertSeverity;
  title: string;
  variant?: OperationalAlertVariant;
}

export function OperationalAlert({
  actions,
  children,
  details,
  impact,
  severity = "warning",
  title,
  variant = "inline",
}: OperationalAlertProps) {
  const hasContent = Boolean(children || details || (variant === "inline" && impact));

  return (
    <Alert
      actions={actions}
      className={`clv-operational-alert clv-operational-alert--${severity}`}
      metadata={
        variant === "featured" && impact ? (
          <span className="clv-operational-alert__impact">{impact}</span>
        ) : undefined
      }
      role="alert"
      status={severity}
      title={title}
      variant={variant}
    >
      {hasContent ? (
        <div className="clv-operational-alert__content">
          {variant === "inline" && impact ? (
            <span className="clv-operational-alert__impact">{impact}</span>
          ) : null}
          {children ? <div>{children}</div> : null}
          {details ? (
            <details>
              <summary>Ver detalhes</summary>
              <div>{details}</div>
            </details>
          ) : null}
        </div>
      ) : null}
    </Alert>
  );
}
