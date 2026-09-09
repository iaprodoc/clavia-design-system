"use client";

import { type ReactNode, useId } from "react";

export type SectionHeading = "h2" | "h3" | "h4" | "h5" | "h6";

export interface SectionProps {
  actions?: ReactNode;
  children: ReactNode;
  description?: ReactNode;
  headingAs?: SectionHeading;
  title: ReactNode;
}

/** Agrupa um assunto de uma página sem substituir o cabeçalho principal dela. */
export function Section({
  actions,
  children,
  description,
  headingAs: Heading = "h2",
  title,
}: SectionProps) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="clv-section">
      <div className="clv-section__header">
        <div>
          <Heading className="clv-section__title" id={titleId}>
            {title}
          </Heading>
          {description ? <p className="clv-section__description">{description}</p> : null}
        </div>
        {actions ? <div className="clv-section__actions">{actions}</div> : null}
      </div>
      <div className="clv-section__content">{children}</div>
    </section>
  );
}
