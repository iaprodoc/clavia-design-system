"use client";

import { type ReactNode, useId } from "react";
import { Dialog as AriaDialog, DialogTrigger, Modal, ModalOverlay } from "react-aria-components";
import {
  OverlayTrigger,
  type OverlayTriggerSize,
  type OverlayTriggerVariant,
} from "./OverlayTrigger";

export interface SheetProps {
  actions?: ReactNode;
  children?: ReactNode;
  defaultOpen?: boolean;
  description?: ReactNode;
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  side?: "bottom" | "left" | "right";
  title: string;
  trigger: ReactNode;
  triggerHidden?: boolean;
  triggerSize?: OverlayTriggerSize;
  triggerVariant?: OverlayTriggerVariant;
}

export function Sheet({
  actions,
  children,
  defaultOpen,
  description,
  isDismissable,
  isKeyboardDismissDisabled,
  isOpen,
  onOpenChange,
  side = "right",
  title,
  trigger,
  triggerHidden,
  triggerSize,
  triggerVariant,
}: SheetProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dismissable = isDismissable ?? true;
  const keyboardDismissDisabled = isKeyboardDismissDisabled ?? false;

  return (
    <DialogTrigger
      {...(defaultOpen === undefined ? {} : { defaultOpen })}
      {...(isOpen === undefined ? {} : { isOpen })}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <OverlayTrigger
        {...(triggerHidden === undefined ? {} : { hidden: triggerHidden })}
        {...(triggerSize === undefined ? {} : { size: triggerSize })}
        {...(triggerVariant === undefined ? {} : { variant: triggerVariant })}
      >
        {trigger}
      </OverlayTrigger>
      <ModalOverlay
        className="clv-sheet__overlay"
        isDismissable={dismissable}
        isKeyboardDismissDisabled={keyboardDismissDisabled}
      >
        <Modal className={`clv-sheet__modal clv-sheet__modal--${side}`}>
          <AriaDialog
            {...(description ? { "aria-describedby": descriptionId } : {})}
            aria-labelledby={titleId}
            className={`clv-sheet clv-sheet--${side}`}
          >
            <div className="clv-sheet__content">
              <h2 id={titleId}>{title}</h2>
              {description ? <p id={descriptionId}>{description}</p> : null}
              {children}
            </div>
            {actions ? <div className="clv-sheet__actions">{actions}</div> : null}
          </AriaDialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
