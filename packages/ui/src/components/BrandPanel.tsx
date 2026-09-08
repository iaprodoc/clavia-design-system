import { type HTMLAttributes, type ReactNode, useId } from "react";

export type BrandPanelHeading = "h1" | "h2" | "h3" | "h4";

export interface BrandPanelProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  actions?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  headingAs?: BrandPanelHeading;
  media?: ReactNode;
  title: ReactNode;
}

export function BrandPanel({
  actions,
  className,
  description,
  eyebrow,
  headingAs: Heading = "h2",
  media,
  title,
  ...props
}: BrandPanelProps) {
  const generatedTitleId = useId();
  const labelledBy = props["aria-labelledby"] ?? generatedTitleId;
  const classes = ["clv-brand-panel", media ? "clv-brand-panel--with-media" : undefined, className]
    .filter(Boolean)
    .join(" ");

  return (
    <section {...props} aria-labelledby={labelledBy} className={classes}>
      <div className="clv-brand-panel__content">
        {eyebrow ? <p className="clv-brand-panel__eyebrow">{eyebrow}</p> : null}
        <Heading className="clv-brand-panel__title" id={generatedTitleId}>
          {title}
        </Heading>
        {description ? <p className="clv-brand-panel__description">{description}</p> : null}
        {actions ? <div className="clv-brand-panel__actions">{actions}</div> : null}
      </div>
      {media ? <div className="clv-brand-panel__media">{media}</div> : null}
    </section>
  );
}
