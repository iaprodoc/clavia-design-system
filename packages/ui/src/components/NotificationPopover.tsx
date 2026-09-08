"use client";

import {
  BellIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  DoubleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "@clavia-ds/icons";
import type { ReactNode } from "react";
import { useId } from "react";
import { Button as AriaButton, Dialog, DialogTrigger, Popover } from "react-aria-components";

export type NotificationPopoverItemTone = "danger" | "info" | "success" | "warning";

export interface NotificationPopoverItem {
  description: ReactNode;
  id: string | number;
  isUnread?: boolean;
  onAction?: () => void;
  time: string;
  title: ReactNode;
  tone?: NotificationPopoverItemTone;
}

export interface NotificationPopoverProps {
  defaultOpen?: boolean;
  emptyDescription?: string;
  emptyTitle?: string;
  isOpen?: boolean;
  items: NotificationPopoverItem[];
  markAllAsReadLabel?: string;
  onMarkAllAsRead?: () => void;
  onOpenChange?: (isOpen: boolean) => void;
  onViewAll?: () => void;
  placement?: "bottom left" | "bottom right" | "top left" | "top right";
  title?: string;
  trigger?: ReactNode;
  triggerLabel?: string;
  viewAllLabel?: string;
}

const toneIcons = {
  danger: CircleAlertIcon,
  info: InfoIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
};

/**
 * Central de notificações persistentes para cabeçalhos de produto.
 * O produto fornece os itens, callbacks e persistência do estado de leitura.
 */
export function NotificationPopover({
  defaultOpen,
  emptyDescription = "Novas atualizações aparecerão aqui.",
  emptyTitle = "Nenhuma notificação",
  isOpen,
  items,
  markAllAsReadLabel = "Marcar todas como lidas",
  onMarkAllAsRead,
  onOpenChange,
  onViewAll,
  placement = "bottom right",
  title = "Notificações",
  trigger,
  triggerLabel = "Ver notificações",
  viewAllLabel = "Ver todas as notificações",
}: NotificationPopoverProps) {
  const titleId = useId();
  const unreadCount = items.filter((item) => item.isUnread).length;
  const unreadLabel = `${unreadCount} ${unreadCount === 1 ? "não lida" : "não lidas"}`;

  return (
    <DialogTrigger
      {...(defaultOpen === undefined ? {} : { defaultOpen })}
      {...(isOpen === undefined ? {} : { isOpen })}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <AriaButton aria-label={triggerLabel} className="clv-notification-popover__trigger">
        {trigger ?? <BellIcon aria-hidden="true" strokeWidth={2.2} />}
        {unreadCount > 0 ? (
          <span aria-hidden="true" className="clv-notification-popover__indicator" />
        ) : null}
      </AriaButton>
      <Popover className="clv-notification-popover" placement={placement}>
        <Dialog aria-labelledby={titleId} className="clv-notification-popover__content">
          <header className="clv-notification-popover__header">
            <span className="clv-notification-popover__heading">
              <h2 id={titleId}>{title}</h2>
              {unreadCount > 0 ? <span>{unreadLabel}</span> : null}
            </span>
            {unreadCount > 0 && onMarkAllAsRead ? (
              <button
                aria-label={markAllAsReadLabel}
                className="clv-notification-popover__header-action"
                onClick={onMarkAllAsRead}
                title={markAllAsReadLabel}
                type="button"
              >
                <DoubleCheckIcon aria-hidden="true" />
              </button>
            ) : null}
          </header>

          {items.length > 0 ? (
            <ul aria-label="Notificações recentes" className="clv-notification-popover__list">
              {items.map((item) => {
                const tone = item.tone ?? "info";
                const ToneIcon = toneIcons[tone];
                const content = (
                  <>
                    <span
                      aria-hidden="true"
                      className="clv-notification-popover__item-icon"
                      data-tone={tone}
                    >
                      <ToneIcon />
                    </span>
                    <span className="clv-notification-popover__item-copy">
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                      <time>{item.time}</time>
                    </span>
                    {item.isUnread ? (
                      <span className="clv-notification-popover__unread">
                        <span aria-hidden="true" />
                        <span className="clv-notification-popover__sr-only">Não lida</span>
                      </span>
                    ) : null}
                  </>
                );

                return (
                  <li className="clv-notification-popover__item" key={item.id}>
                    {item.onAction ? (
                      <button
                        className="clv-notification-popover__item-action"
                        onClick={item.onAction}
                        type="button"
                      >
                        {content}
                      </button>
                    ) : (
                      <div className="clv-notification-popover__item-content">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="clv-notification-popover__empty">
              <BellIcon aria-hidden="true" />
              <strong>{emptyTitle}</strong>
              <span>{emptyDescription}</span>
            </div>
          )}

          {onViewAll ? (
            <footer className="clv-notification-popover__footer">
              <button onClick={onViewAll} type="button">
                {viewAllLabel}
              </button>
            </footer>
          ) : null}
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
