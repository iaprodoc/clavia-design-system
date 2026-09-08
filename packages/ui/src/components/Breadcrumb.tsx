import { ChevronRightIcon } from "@clavia-ds/icons";
import type { ReactNode } from "react";

export interface BreadcrumbItem {
  href?: string;
  id: string;
  label: ReactNode;
}

export interface BreadcrumbProps {
  items: readonly BreadcrumbItem[];
  label?: string;
}

export function Breadcrumb({ items, label = "Navegação estrutural" }: BreadcrumbProps) {
  return (
    <nav aria-label={label} className="clv-breadcrumb">
      <ol className="clv-breadcrumb__list">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li className="clv-breadcrumb__item" key={item.id}>
              {index > 0 ? (
                <ChevronRightIcon aria-hidden="true" className="clv-breadcrumb__separator" />
              ) : null}
              {isCurrent || !item.href ? (
                <span
                  aria-current={isCurrent ? "page" : undefined}
                  className="clv-breadcrumb__current"
                >
                  {item.label}
                </span>
              ) : (
                <a className="clv-breadcrumb__link" href={item.href}>
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
