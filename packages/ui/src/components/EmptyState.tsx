import { type ReactNode, useId } from "react";

const emptyStateImageUrl = new URL("../assets/img_empty_state2.webp", import.meta.url).href;

export interface EmptyStateProps {
  action?: ReactNode;
  className?: string;
  description: string;
  illustration?: ReactNode;
  title: string;
}

export function EmptyState({
  action,
  className,
  description,
  illustration = (
    <img
      alt=""
      className="clv-empty-state__visual"
      data-empty-state-asset="img_empty_state2.webp"
      draggable={false}
      src={emptyStateImageUrl}
    />
  ),
  title,
}: EmptyStateProps) {
  const titleId = useId();
  const classes = ["clv-empty-state", className].filter(Boolean).join(" ");

  return (
    <section aria-labelledby={titleId} className={classes}>
      {illustration ? <div className="clv-empty-state__illustration">{illustration}</div> : null}
      <h2 id={titleId}>{title}</h2>
      <p>{description}</p>
      {action ? <div className="clv-empty-state__action">{action}</div> : null}
    </section>
  );
}
