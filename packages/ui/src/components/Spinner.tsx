import type { SVGAttributes } from "react";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerTone =
  | "neutral"
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "inverse";

export interface SpinnerProps extends Omit<SVGAttributes<SVGSVGElement>, "children"> {
  /** Nome acessível anunciado enquanto a operação está em andamento. */
  label?: string;
  size?: SpinnerSize;
  tone?: SpinnerTone;
}

/** Indica uma espera sem progresso mensurável. */
export function Spinner({
  className,
  label = "Carregando",
  size = "md",
  tone = "neutral",
  ...props
}: SpinnerProps) {
  const classes = ["clv-spinner", `clv-spinner--${size}`, `clv-spinner--${tone}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      aria-label={label}
      className={classes}
      fill="none"
      role="status"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        className="clv-spinner__track"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <circle
        className="clv-spinner__indicator"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeDasharray="40 24"
        strokeLinecap="round"
        strokeWidth="4"
        transform="rotate(-90 12 12)"
      />
    </svg>
  );
}
