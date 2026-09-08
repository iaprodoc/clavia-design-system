"use client";

import { type ReactNode, useId } from "react";
import {
  Button as AriaButton,
  Popover as AriaPopover,
  Dialog,
  DialogTrigger,
} from "react-aria-components";

export type PopoverPlacement =
  | "bottom"
  | "bottom left"
  | "bottom right"
  | "top"
  | "top left"
  | "top right";
export interface PopoverProps {
  children: ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  placement?: PopoverPlacement;
  title: string;
  trigger: ReactNode;
}

export function Popover({
  children,
  defaultOpen,
  isOpen,
  onOpenChange,
  placement = "bottom",
  title,
  trigger,
}: PopoverProps) {
  const titleId = useId();

  return (
    <DialogTrigger
      {...(defaultOpen === undefined ? {} : { defaultOpen })}
      {...(isOpen === undefined ? {} : { isOpen })}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <AriaButton className="clv-popover__trigger">{trigger}</AriaButton>
      <AriaPopover className="clv-popover" placement={placement}>
        <Dialog aria-labelledby={titleId} className="clv-popover__content">
          <h2 id={titleId}>{title}</h2>
          {children}
        </Dialog>
      </AriaPopover>
    </DialogTrigger>
  );
}
