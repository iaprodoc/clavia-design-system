import type { ButtonHTMLAttributes, ReactNode } from "react";

export type IconButtonSize = "xs" | "sm" | "md" | "lg";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isDisabled?: boolean;
  isLoading?: boolean;
  label: string;
  size?: IconButtonSize;
}

export function IconButton({
  children,
  className,
  disabled,
  isDisabled = false,
  isLoading = false,
  label,
  size = "md",
  type = "button",
  ...props
}: IconButtonProps) {
  const classes = ["clv-icon-button", `clv-icon-button--size-${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      aria-busy={isLoading || undefined}
      aria-label={label}
      className={classes}
      disabled={disabled || isDisabled || isLoading}
      type={type}
      {...props}
    >
      <span aria-hidden={isLoading || undefined} className="clv-icon-button__content">
        {children}
      </span>
      {isLoading ? <span aria-hidden="true" className="clv-icon-button__spinner" /> : null}
    </button>
  );
}
