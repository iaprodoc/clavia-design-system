"use client";

import type { ReactNode } from "react";
import {
  Button as AriaButton,
  Tooltip as AriaTooltip,
  OverlayArrow,
  TooltipTrigger,
} from "react-aria-components";

export type TooltipPlacement = "bottom" | "left" | "right" | "top";

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  defaultOpen?: boolean;
  delay?: number;
  disabled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  placement?: TooltipPlacement;
  showArrow?: boolean;
  triggerLabel: string;
}

export function Tooltip({
  children,
  content,
  defaultOpen,
  delay = 0,
  disabled = false,
  isOpen,
  onOpenChange,
  placement = "top",
  showArrow = true,
  triggerLabel,
}: TooltipProps) {
  return (
    <TooltipTrigger
      closeDelay={0}
      delay={delay}
      {...(defaultOpen === undefined ? {} : { defaultOpen })}
      {...(isOpen === undefined ? {} : { isOpen })}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <AriaButton
        aria-label={triggerLabel}
        className="clv-tooltip__trigger"
        isDisabled={disabled}
        onClick={(event) => {
          event.currentTarget.focus();
        }}
      >
        {children}
      </AriaButton>
      <AriaTooltip className="clv-tooltip__content" offset={8} placement={placement}>
        {showArrow ? (
          <OverlayArrow className="clv-tooltip__arrow">
            <svg aria-hidden="true" height="8" viewBox="0 0 8 8" width="8">
              <path d="M0 0 4 4 8 0" />
            </svg>
          </OverlayArrow>
        ) : null}
        <span className="clv-tooltip__label">{content}</span>
      </AriaTooltip>
    </TooltipTrigger>
  );
}
