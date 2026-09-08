"use client";

import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from "@clavia-ds/icons";
import { type MouseEvent, type ReactNode, useContext, useId } from "react";
import {
  Dialog as AriaDialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
  OverlayTriggerStateContext,
} from "react-aria-components";
import { CloseButton } from "./CloseButton";
import {
  OverlayTrigger,
  type OverlayTriggerSize,
  type OverlayTriggerVariant,
} from "./OverlayTrigger";

export interface DialogProps {
  actions?: ReactNode;
  closeButtonLabel?: string;
  children?: ReactNode;
  defaultOpen?: boolean;
  description?: ReactNode;
  headerIcon?: ReactNode;
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  showCloseButton?: boolean;
  title: string;
  tone?: DialogTone;
  trigger: ReactNode;
  triggerHidden?: boolean;
  triggerSize?: OverlayTriggerSize;
  triggerVariant?: OverlayTriggerVariant;
  variant?: "alert" | "default" | "filter";
}

export type DialogTone = "danger" | "info" | "success" | "warning";

interface DialogSurfaceProps {
  actions?: ReactNode;
  closeButtonLabel: string;
  children?: ReactNode;
  description?: ReactNode;
  descriptionId: string;
  headerIcon?: ReactNode;
  showCloseButton: boolean;
  title: string;
  titleId: string;
  tone?: DialogTone;
  variant: "alert" | "default" | "filter";
}

const iconByTone: Record<DialogTone, ReactNode> = {
  danger: <CircleAlertIcon />,
  info: <InfoIcon />,
  success: <CircleCheckIcon />,
  warning: <TriangleAlertIcon />,
};

function DialogSurface({
  actions,
  closeButtonLabel,
  children,
  description,
  descriptionId,
  headerIcon,
  showCloseButton,
  title,
  titleId,
  tone,
  variant,
}: DialogSurfaceProps) {
  const overlayTriggerState = useContext(OverlayTriggerStateContext);

  function handleClick(event: MouseEvent<HTMLElement>) {
    const target = event.target as HTMLElement;

    if (target.closest('[slot="close"]')) {
      overlayTriggerState?.close();
    }
  }

  const resolvedHeaderIcon =
    headerIcon ?? (tone ? iconByTone[tone] : variant === "default" ? <InfoIcon /> : null);

  return (
    <AriaDialog
      {...(description ? { "aria-describedby": descriptionId } : {})}
      aria-labelledby={titleId}
      className={`clv-dialog clv-dialog--${variant}`}
      data-tone={tone}
      onClick={handleClick}
      role={variant === "alert" ? "alertdialog" : "dialog"}
    >
      <div className="clv-dialog__content">
        {resolvedHeaderIcon || showCloseButton ? (
          <div className="clv-dialog__header">
            {resolvedHeaderIcon ? (
              <span aria-hidden="true" className="clv-dialog__header-icon">
                {resolvedHeaderIcon}
              </span>
            ) : null}
            {showCloseButton ? (
              <CloseButton className="clv-dialog__close" label={closeButtonLabel} slot="close" />
            ) : null}
          </div>
        ) : null}
        <h2 id={titleId}>{title}</h2>
        {description ? <p id={descriptionId}>{description}</p> : null}
        {children}
      </div>
      {actions ? <div className="clv-dialog__actions">{actions}</div> : null}
    </AriaDialog>
  );
}

export function Dialog({
  actions,
  closeButtonLabel = "Fechar",
  children,
  defaultOpen,
  description,
  headerIcon,
  isDismissable,
  isKeyboardDismissDisabled,
  isOpen,
  onOpenChange,
  showCloseButton,
  title,
  tone: toneProp,
  trigger,
  triggerHidden,
  triggerSize,
  triggerVariant,
  variant = "default",
}: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dismissable = isDismissable ?? variant !== "alert";
  const keyboardDismissDisabled = isKeyboardDismissDisabled ?? variant === "alert";
  const tone = toneProp ?? (variant === "alert" ? "warning" : undefined);
  const shouldShowCloseButton = showCloseButton ?? true;

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
        className="clv-dialog__overlay"
        isDismissable={dismissable}
        isKeyboardDismissDisabled={keyboardDismissDisabled}
      >
        <Modal className="clv-dialog__modal">
          <DialogSurface
            actions={actions}
            closeButtonLabel={closeButtonLabel}
            description={description}
            descriptionId={descriptionId}
            headerIcon={headerIcon}
            showCloseButton={shouldShowCloseButton}
            title={title}
            titleId={titleId}
            {...(tone === undefined ? {} : { tone })}
            variant={variant}
          >
            {children}
          </DialogSurface>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
