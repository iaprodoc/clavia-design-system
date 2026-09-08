"use client";

import { DotsThreeIcon } from "@clavia-ds/icons";
import type { ReactNode } from "react";
import { Button as AriaButton, Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";

export interface DropdownMenuItem {
  hasSeparatorBefore?: boolean;
  icon?: ReactNode;
  id: string | number;
  isDisabled?: boolean;
  isDestructive?: boolean;
  label: ReactNode;
  onAction?: () => void;
}

export type DropdownMenuTriggerVariant = "default" | "overflow";

export interface DropdownMenuProps {
  defaultOpen?: boolean;
  isOpen?: boolean;
  items: DropdownMenuItem[];
  label: string;
  onOpenChange?: (isOpen: boolean) => void;
  placement?: "bottom left" | "bottom right" | "top left" | "top right";
  trigger?: ReactNode;
  triggerLabel?: string;
  triggerVariant?: DropdownMenuTriggerVariant;
}

export function DropdownMenu({
  defaultOpen,
  isOpen,
  items,
  label,
  onOpenChange,
  placement = "bottom right",
  trigger,
  triggerLabel,
  triggerVariant = "default",
}: DropdownMenuProps) {
  const triggerClasses = [
    "clv-dropdown-menu__trigger",
    triggerVariant === "overflow" ? "clv-dropdown-menu__trigger--overflow" : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <MenuTrigger
      {...(defaultOpen === undefined ? {} : { defaultOpen })}
      {...(isOpen === undefined ? {} : { isOpen })}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <AriaButton
        {...(triggerLabel ? { "aria-label": triggerLabel } : {})}
        className={triggerClasses}
      >
        {triggerVariant === "overflow"
          ? (trigger ?? <DotsThreeIcon aria-hidden="true" />)
          : trigger}
      </AriaButton>
      <Popover className="clv-dropdown-menu" placement={placement}>
        <Menu aria-label={label} className="clv-dropdown-menu__list" items={items}>
          {(item) => {
            const itemIndex = items.findIndex((candidate) => candidate.id === item.id);
            const isFirstDestructive =
              item.isDestructive &&
              !items.slice(0, itemIndex).some((candidate) => candidate.isDestructive);
            const hasSeparatorBefore = item.hasSeparatorBefore || isFirstDestructive;

            return (
              <MenuItem
                className={[
                  "clv-dropdown-menu__item",
                  item.isDestructive ? "clv-dropdown-menu__item--destructive" : undefined,
                  hasSeparatorBefore ? "clv-dropdown-menu__item--separator-before" : undefined,
                  isFirstDestructive ? "clv-dropdown-menu__item--first-destructive" : undefined,
                ]
                  .filter(Boolean)
                  .join(" ")}
                id={item.id}
                {...(item.isDestructive ? { "data-destructive": "true" } : {})}
                {...(item.isDisabled === undefined ? {} : { isDisabled: item.isDisabled })}
                {...(item.onAction ? { onAction: item.onAction } : {})}
                {...(typeof item.label === "string" ? { textValue: item.label } : {})}
              >
                {item.icon ? (
                  <span aria-hidden="true" className="clv-dropdown-menu__item-icon">
                    {item.icon}
                  </span>
                ) : null}
                <span className="clv-dropdown-menu__item-label">{item.label}</span>
              </MenuItem>
            );
          }}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
