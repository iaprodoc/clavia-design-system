import type { ReactNode } from "react";

export type PageHeaderHeading = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type PageHeaderSize = "compact" | "default";
export type PageHeaderVariant = "plain" | "surface";

export interface PageHeaderProps {
  actions?: ReactNode;
  className?: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
  headingAs?: PageHeaderHeading;
  navigation?: ReactNode;
  size?: PageHeaderSize;
  title: ReactNode;
  variant?: PageHeaderVariant;
}

export function PageHeader({
  actions,
  className,
  description,
  eyebrow,
  headingAs: Heading = "h1",
  navigation,
  size = "default",
  title,
  variant = "surface",
}: PageHeaderProps) {
  return (
    <header
      className={["clv-page-header", className].filter(Boolean).join(" ")}
      data-size={size}
      data-variant={variant}
    >
      {navigation ? <div className="clv-page-header__navigation">{navigation}</div> : null}
      <div className="clv-page-header__body">
        <div className="clv-page-header__content">
          {eyebrow ? <p className="clv-page-header__eyebrow">{eyebrow}</p> : null}
          <Heading className="clv-page-header__title">{title}</Heading>
          {description ? <p className="clv-page-header__description">{description}</p> : null}
        </div>
        {actions ? <div className="clv-page-header__actions">{actions}</div> : null}
      </div>
    </header>
  );
}
