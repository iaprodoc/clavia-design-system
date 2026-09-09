"use client";

import { CircleAlertIcon } from "@clavia-ds/icons";
import { type ReactNode, useId } from "react";

export interface ErrorStateProps {
  action?: ReactNode;
  className?: string;
  description: string;
  icon?: ReactNode;
  title: string;
}

/**
 * Explica uma falha que impede a área de continuar e apresenta a recuperação disponível.
 */
export function ErrorState({
  action,
  className,
  description,
  icon = <CircleAlertIcon />,
  title,
}: ErrorStateProps) {
  const titleId = useId();
  const descriptionId = useId();
  const classes = ["clv-error-state", className].filter(Boolean).join(" ");

  return (
    <section
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className={classes}
      role="alert"
    >
      <span aria-hidden="true" className="clv-error-state__icon">
        {icon}
      </span>
      <h2 id={titleId}>{title}</h2>
      <p id={descriptionId}>{description}</p>
      {action ? <div className="clv-error-state__action">{action}</div> : null}
    </section>
  );
}
