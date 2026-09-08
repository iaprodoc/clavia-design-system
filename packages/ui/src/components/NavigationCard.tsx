import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface NavigationCardProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href"> {
  description?: ReactNode;
  href: string;
  leadingIcon?: ReactNode;
  title: string;
}

/** Um destino persistente de navegação; use ActionCard para executar uma ação no contexto atual. */
export function NavigationCard({
  description,
  href,
  leadingIcon,
  title,
  ...props
}: NavigationCardProps) {
  return (
    <a
      {...props}
      className={["clv-navigation-card", props.className].filter(Boolean).join(" ")}
      href={href}
    >
      {leadingIcon ? (
        <span aria-hidden="true" className="clv-navigation-card__icon">
          {leadingIcon}
        </span>
      ) : null}
      <span className="clv-navigation-card__content">
        <span className="clv-navigation-card__title">{title}</span>
        {description ? (
          <span className="clv-navigation-card__description">{description}</span>
        ) : null}
      </span>
    </a>
  );
}
