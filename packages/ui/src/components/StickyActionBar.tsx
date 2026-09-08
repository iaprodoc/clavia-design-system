import type { ReactNode } from "react";

export type StickyActionBarTone = "default" | "on-dark";

export interface StickyActionBarProps {
  label?: string;
  previousAction?: ReactNode;
  primaryAction: ReactNode;
  status?: ReactNode;
  /** Use `on-dark` quando a dock estiver sobre uma superfície escura ou colorida. */
  tone?: StickyActionBarTone;
}

export function StickyActionBar({
  label = "Ações da etapa",
  previousAction,
  primaryAction,
  status,
  tone = "default",
}: StickyActionBarProps) {
  const actionCount = previousAction ? 2 : 1;

  return (
    <section aria-label={label} className="clv-sticky-action-bar" data-tone={tone}>
      <div className="clv-sticky-action-bar__inner">
        {status ? <div className="clv-sticky-action-bar__status">{status}</div> : null}
        <div className="clv-sticky-action-bar__actions" data-action-count={actionCount}>
          {previousAction}
          {primaryAction}
        </div>
      </div>
    </section>
  );
}
