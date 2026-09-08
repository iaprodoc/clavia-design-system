import { CheckIcon } from "@clavia-ds/icons";
import type { HTMLAttributes, ReactNode } from "react";

export type StatusKind = "neutral" | "success" | "warning" | "danger" | "info";
export type StatusBadgeSize = "xs" | "sm" | "md";
export type StatusBadgeVariant = "solid" | "soft" | "outline";

export interface StatusBadgeProps
  extends Pick<HTMLAttributes<HTMLSpanElement>, "className" | "id"> {
  children: string;
  leadingIcon?: ReactNode;
  size?: StatusBadgeSize;
  status?: StatusKind;
  trailingIcon?: ReactNode;
  variant?: StatusBadgeVariant;
}

export function StatusBadgeCheckIcon() {
  return (
    <span aria-hidden="true" className="clv-status-badge__check-icon">
      <CheckIcon />
    </span>
  );
}

export function StatusBadge({
  children,
  className,
  id,
  leadingIcon,
  size = "sm",
  status = "neutral",
  trailingIcon,
  variant = "outline",
}: StatusBadgeProps) {
  const classes = [
    "clv-status-badge",
    `clv-status-badge--${status}`,
    `clv-status-badge--${variant}`,
    `clv-status-badge--size-${size}`,
    leadingIcon && "clv-status-badge--has-leading-icon",
    trailingIcon && "clv-status-badge--has-trailing-icon",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} data-size={size} data-status={status} data-variant={variant} id={id}>
      {leadingIcon ? (
        <span aria-hidden="true" className="clv-status-badge__icon clv-status-badge__icon--leading">
          {leadingIcon}
        </span>
      ) : null}
      <span className="clv-status-badge__label">{children}</span>
      {trailingIcon ? (
        <span
          aria-hidden="true"
          className="clv-status-badge__icon clv-status-badge__icon--trailing"
        >
          {trailingIcon}
        </span>
      ) : null}
    </span>
  );
}
