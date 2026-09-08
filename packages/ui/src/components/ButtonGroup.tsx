import type { ReactNode } from "react";

import {
  ButtonGroupContext,
  type ButtonGroupContextValue,
  type ButtonSize,
  type ButtonVariant,
} from "./Button";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export interface ButtonGroupProps {
  children: ReactNode;
  fullWidth?: boolean;
  hideSeparator?: boolean;
  isDisabled?: boolean;
  label: string;
  orientation?: ButtonGroupOrientation;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

/** Agrupa ações relacionadas sem redefinir sua hierarquia ou seu comportamento. */
export function ButtonGroup({
  children,
  fullWidth = false,
  hideSeparator = false,
  isDisabled = false,
  label,
  orientation = "horizontal",
  size,
  variant,
}: ButtonGroupProps) {
  const contextValue: ButtonGroupContextValue = {
    ...(fullWidth ? { fullWidth: true } : {}),
    ...(isDisabled ? { isDisabled: true } : {}),
    ...(size ? { size } : {}),
    ...(variant ? { variant } : {}),
  };
  const classes = [
    "clv-button-group",
    `clv-button-group--${orientation}`,
    !hideSeparator && orientation === "horizontal" && "clv-button-group--joined",
    fullWidth && "clv-button-group--full-width",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ButtonGroupContext.Provider value={contextValue}>
      <fieldset
        className={classes}
        data-disabled={isDisabled ? "true" : undefined}
        data-variant={variant}
      >
        <legend className="clv-sr-only">{label}</legend>
        {children}
      </fieldset>
    </ButtonGroupContext.Provider>
  );
}
