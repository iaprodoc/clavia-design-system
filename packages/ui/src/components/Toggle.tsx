"use client";

import { type ButtonHTMLAttributes, type ReactNode, useState } from "react";

export type ToggleSize = "sm" | "md" | "lg";
export type ToggleVariant = "default" | "outline";

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed" | "children"> {
  children?: ReactNode;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  pressed?: boolean;
  size?: ToggleSize;
  variant?: ToggleVariant;
}

export function toggleClassName({
  className,
  size,
  variant,
}: Pick<ToggleProps, "className" | "size" | "variant">) {
  return [
    "clv-toggle",
    `clv-toggle--${variant ?? "default"}`,
    `clv-toggle--size-${size ?? "md"}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Toggle({
  children,
  className,
  defaultPressed = false,
  disabled = false,
  onClick,
  onPressedChange,
  pressed,
  size = "md",
  type = "button",
  variant = "default",
  ...props
}: ToggleProps) {
  const [internalPressed, setInternalPressed] = useState(defaultPressed);
  const isControlled = pressed !== undefined;
  const currentPressed = isControlled ? pressed : internalPressed;

  return (
    <button
      {...props}
      aria-pressed={currentPressed}
      className={toggleClassName({ className, size, variant })}
      data-state={currentPressed ? "on" : "off"}
      disabled={disabled}
      onClick={(event) => {
        const nextPressed = !currentPressed;

        if (!isControlled) {
          setInternalPressed(nextPressed);
        }

        onPressedChange?.(nextPressed);
        onClick?.(event);
      }}
      type={type}
    >
      {children}
    </button>
  );
}
