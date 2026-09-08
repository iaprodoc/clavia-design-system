import { type ReactNode, useId } from "react";

export interface LoadingStateProps {
  children?: ReactNode;
  description?: string;
  label?: string;
}
export function LoadingState({ children, description, label = "Carregando" }: LoadingStateProps) {
  const descriptionId = useId();

  return (
    <section
      aria-busy="true"
      aria-describedby={description ? descriptionId : undefined}
      aria-label={label}
      className="clv-loading-state"
      data-state="loading"
      role="status"
    >
      <span aria-hidden="true" className="clv-loading-state__spinner" />
      <strong className="clv-loading-state__label">{label}</strong>
      {description ? <p id={descriptionId}>{description}</p> : null}
      {children ? <div className="clv-loading-state__content">{children}</div> : null}
    </section>
  );
}
