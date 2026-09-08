"use client";

import type { ReactNode } from "react";
import { Button as AriaButton } from "react-aria-components";

export type OverlayTriggerSize = "xs" | "sm" | "md" | "lg";
export type OverlayTriggerVariant =
  | "danger"
  | "ghost"
  | "primary"
  | "secondary"
  | "surface"
  | "tertiary"
  | "text";

export interface OverlayTriggerProps {
  children: ReactNode;
  disabled?: boolean;
  hidden?: boolean;
  size?: OverlayTriggerSize;
  variant?: OverlayTriggerVariant;
}

export function OverlayTrigger({
  children,
  disabled = false,
  hidden = false,
  size = "md",
  variant = "secondary",
}: OverlayTriggerProps) {
  const className = hidden
    ? "clv-sr-only"
    : `clv-overlay-trigger clv-button clv-button--${variant} clv-button--size-${size}`;

  return (
    <AriaButton className={className} isDisabled={disabled} type="button">
      <span className="clv-button__label">{children}</span>
    </AriaButton>
  );
}
