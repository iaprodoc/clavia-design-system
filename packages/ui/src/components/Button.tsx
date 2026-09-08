import type { ButtonHTMLAttributes, ReactNode } from "react";
import { createContext, useContext } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "surface"
  | "ghost"
  | "text"
  | "danger"
  | "danger-soft"
  | "gradient"
  | "glass"
  | "adaptive-glass";

export type ButtonSize = "xs" | "sm" | "md" | "lg";
export type ButtonTone = "default" | "on-dark";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
  isDisabled?: boolean;
  isIconOnly?: boolean;
  isLoading?: boolean;
  isPending?: boolean;
  leadingIcon?: ReactNode;
  size?: ButtonSize;
  /** Define o contexto visual de `adaptive-glass`. */
  tone?: ButtonTone;
  trailingIcon?: ReactNode;
  variant?: ButtonVariant;
}

export interface ButtonGroupContextValue {
  fullWidth?: boolean;
  isDisabled?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

export function Button({
  children,
  className,
  disabled,
  fullWidth = false,
  isDisabled,
  isIconOnly = false,
  isLoading = false,
  isPending = false,
  leadingIcon,
  tone = "default",
  type = "button",
  trailingIcon,
  size,
  variant,
  ...props
}: ButtonProps) {
  const groupContext = useContext(ButtonGroupContext);
  const resolvedFullWidth = fullWidth || Boolean(groupContext?.fullWidth);
  const resolvedIsDisabled =
    disabled || isDisabled || (isDisabled === undefined && Boolean(groupContext?.isDisabled));
  const resolvedIsLoading = isLoading || isPending;
  const resolvedSize = size ?? groupContext?.size ?? "md";
  const resolvedVariant = variant ?? groupContext?.variant ?? "primary";
  const hasIcon = !isIconOnly && Boolean(leadingIcon || trailingIcon);
  const hasLeadingIcon = hasIcon && Boolean(leadingIcon);
  const classes = [
    "clv-button",
    `clv-button--${resolvedVariant}`,
    `clv-button--size-${resolvedSize}`,
    resolvedFullWidth && "clv-button--full-width",
    hasIcon && "clv-button--has-icon",
    hasLeadingIcon && "clv-button--has-leading-icon",
    isIconOnly && "clv-button--icon-only",
    trailingIcon && "clv-button--has-trailing-icon",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      aria-busy={resolvedIsLoading || undefined}
      className={classes}
      data-tone={resolvedVariant === "adaptive-glass" ? tone : undefined}
      disabled={resolvedIsDisabled || resolvedIsLoading}
      type={type}
      {...props}
    >
      {leadingIcon ? (
        <span aria-hidden="true" className="clv-button__icon clv-button__icon--leading">
          {leadingIcon}
        </span>
      ) : null}
      {resolvedIsLoading ? <span aria-hidden="true" className="clv-button__spinner" /> : null}
      <span aria-hidden={isIconOnly || undefined} className="clv-button__label">
        {children}
      </span>
      {trailingIcon ? (
        <span aria-hidden="true" className="clv-button__icon clv-button__icon--trailing">
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
}
