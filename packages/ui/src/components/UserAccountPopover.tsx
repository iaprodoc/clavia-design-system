"use client";

import { ChevronDownIcon, SignOutIcon } from "@clavia-ds/icons";
import type { ReactNode } from "react";
import { Button as AriaButton, Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";

import { Avatar, type AvatarSize } from "./Avatar";

export interface UserAccountPopoverItem {
  icon?: ReactNode;
  id: string | number;
  isDisabled?: boolean;
  label: ReactNode;
  onAction?: () => void;
}

export interface UserAccountPopoverProps {
  /** Texto alternativo da foto. Quando ausente, usa o nome da pessoa. */
  avatarAlt?: string;
  avatarInitials?: string;
  avatarSize?: AvatarSize;
  avatarSrc?: string;
  defaultOpen?: boolean;
  email: string;
  isOpen?: boolean;
  items: UserAccountPopoverItem[];
  label?: string;
  name: string;
  onOpenChange?: (isOpen: boolean) => void;
  onSignOut?: () => void;
  placement?: "bottom left" | "bottom right" | "top left" | "top right";
  signOutLabel?: string;
  trigger?: ReactNode;
  triggerLabel?: string;
}

/**
 * Menu de conta para cabeçalhos de produto. Reúne a identidade da sessão,
 * atalhos pessoais e a ação de sair em uma superfície ancorada ao avatar.
 */
export function UserAccountPopover({
  avatarAlt,
  avatarInitials,
  avatarSize = "md",
  avatarSrc,
  defaultOpen,
  email,
  isOpen,
  items,
  label,
  name,
  onOpenChange,
  onSignOut,
  placement = "bottom right",
  signOutLabel = "Sair",
  trigger,
  triggerLabel = `Abrir menu de ${name}`,
}: UserAccountPopoverProps) {
  const avatarProps = {
    ...(avatarAlt === undefined ? {} : { alt: avatarAlt }),
    ...(avatarInitials === undefined ? {} : { initials: avatarInitials }),
    ...(avatarSrc === undefined ? {} : { src: avatarSrc }),
    name,
  };

  return (
    <MenuTrigger
      {...(defaultOpen === undefined ? {} : { defaultOpen })}
      {...(isOpen === undefined ? {} : { isOpen })}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <AriaButton aria-label={triggerLabel} className="clv-user-account-popover__trigger">
        {trigger ?? (
          <span className="clv-user-account-popover__default-trigger">
            <Avatar {...avatarProps} size={avatarSize} />
            <ChevronDownIcon aria-hidden="true" />
          </span>
        )}
      </AriaButton>
      <Popover className="clv-user-account-popover" placement={placement}>
        <div className="clv-user-account-popover__identity">
          <Avatar {...avatarProps} size="lg" />
          <span className="clv-user-account-popover__identity-copy">
            <strong>{name}</strong>
            <span>{email}</span>
          </span>
        </div>
        <Menu
          aria-label={label ?? `Opções da conta de ${name}`}
          className="clv-user-account-popover__list"
          items={items}
        >
          {(item) => (
            <MenuItem
              className="clv-user-account-popover__item"
              id={item.id}
              {...(item.isDisabled === undefined ? {} : { isDisabled: item.isDisabled })}
              {...(item.onAction ? { onAction: item.onAction } : {})}
              {...(typeof item.label === "string" ? { textValue: item.label } : {})}
            >
              {item.icon ? (
                <span aria-hidden="true" className="clv-user-account-popover__item-icon">
                  {item.icon}
                </span>
              ) : null}
              <span>{item.label}</span>
            </MenuItem>
          )}
        </Menu>
        <div className="clv-user-account-popover__footer">
          <button className="clv-user-account-popover__sign-out" onClick={onSignOut} type="button">
            <SignOutIcon aria-hidden="true" />
            {signOutLabel}
          </button>
        </div>
      </Popover>
    </MenuTrigger>
  );
}
