import type { FormHTMLAttributes, ReactNode } from "react";

export interface FilterBarProps extends Omit<FormHTMLAttributes<HTMLFormElement>, "children"> {
  clearLabel?: string;
  children: ReactNode;
  onClear?: () => void;
  summary?: string;
}

export function FilterBar({
  children,
  className,
  clearLabel = "Limpar filtros",
  onClear,
  summary,
  ...props
}: FilterBarProps) {
  const classes = ["clv-filter-bar", className].filter(Boolean).join(" ");

  return (
    <form className={classes} {...props}>
      <div className="clv-filter-bar__controls">{children}</div>
      {summary || onClear ? (
        <div className="clv-filter-bar__meta">
          {summary ? (
            <p aria-live="polite" className="clv-filter-bar__summary">
              {summary}
            </p>
          ) : null}
          {onClear ? (
            <button className="clv-filter-bar__clear" onClick={onClear} type="button">
              {clearLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
