import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface NavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  current?: boolean;
  href: string;
  /** Ícone que acompanha o rótulo; ele é decorativo porque o link já tem nome acessível. */
  icon?: ReactNode;
}

export function NavItem({ children, className, current = false, icon, ...props }: NavItemProps) {
  const classes = ["clv-nav-item", className].filter(Boolean).join(" ");

  return (
    <a aria-current={current ? "page" : undefined} className={classes} {...props}>
      {icon ? (
        <span aria-hidden="true" className="clv-nav-item__icon">
          {icon}
        </span>
      ) : null}
      <span className="clv-nav-item__label">{children}</span>
    </a>
  );
}
