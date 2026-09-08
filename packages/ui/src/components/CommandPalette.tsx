"use client";

import { SearchIcon } from "@clavia-ds/icons";
import { type ReactNode, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  ListBox,
  ListBoxItem,
  Modal,
  ModalOverlay,
} from "react-aria-components";

export interface CommandPaletteItem {
  description?: string;
  group?: string;
  id: string;
  isDisabled?: boolean;
  keywords?: readonly string[];
  label: string;
  onAction?: () => void;
  shortcut?: string;
}

export type CommandPaletteTriggerVariant = "default" | "compact";

export interface CommandPaletteProps {
  defaultOpen?: boolean;
  emptyMessage?: string;
  isOpen?: boolean;
  items: readonly CommandPaletteItem[];
  label?: string;
  onOpenChange?: (isOpen: boolean) => void;
  placeholder?: string;
  trigger: ReactNode;
  /** Aparência do acionador. Use compact em topbars e shells com pouco espaço. */
  triggerVariant?: CommandPaletteTriggerVariant;
}

/**
 * Oferece busca rápida entre ações ou destinos conhecidos. O produto mantém
 * roteamento, permissões e carregamento assíncrono fora deste contrato.
 */
export function CommandPalette({
  defaultOpen = false,
  emptyMessage = "Nenhuma ação encontrada.",
  isOpen,
  items,
  label = "Busca rápida",
  onOpenChange,
  placeholder = "Buscar uma ação…",
  trigger,
  triggerVariant = "default",
}: CommandPaletteProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [query, setQuery] = useState("");
  const searchId = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const open = isOpen ?? uncontrolledOpen;
  const setOpen = (nextOpen: boolean) => {
    if (isOpen === undefined) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };
  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    if (!normalizedQuery) {
      return items;
    }
    return items.filter((item) =>
      [item.label, item.description, ...(item.keywords ?? [])]
        .filter(Boolean)
        .some((value) => value?.toLocaleLowerCase("pt-BR").includes(normalizedQuery)),
    );
  }, [items, query]);

  useEffect(() => {
    if (open) {
      searchRef.current?.focus();
    }
  }, [open]);

  return (
    <>
      <AriaButton
        className={`clv-command-palette__trigger clv-command-palette__trigger--${triggerVariant}`}
        data-trigger-variant={triggerVariant}
        onPress={() => setOpen(true)}
      >
        {trigger}
      </AriaButton>
      <ModalOverlay
        className="clv-command-palette__overlay"
        isDismissable
        isOpen={open}
        onOpenChange={setOpen}
      >
        <Modal className="clv-command-palette__modal">
          <AriaDialog aria-label={label} className="clv-command-palette">
            <div className="clv-command-palette__search">
              <SearchIcon aria-hidden="true" />
              <label className="clv-sr-only" htmlFor={searchId}>
                {label}
              </label>
              <input
                id={searchId}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={placeholder}
                ref={searchRef}
                type="search"
                value={query}
              />
            </div>
            <ListBox
              aria-label={`${label}: resultados`}
              className="clv-command-palette__list"
              renderEmptyState={() => <p className="clv-command-palette__empty">{emptyMessage}</p>}
            >
              {filteredItems.map((item) => (
                <ListBoxItem
                  className="clv-command-palette__item"
                  id={item.id}
                  key={item.id}
                  onAction={() => {
                    item.onAction?.();
                    setOpen(false);
                  }}
                  textValue={item.label}
                  {...(item.isDisabled ? { isDisabled: true } : {})}
                >
                  <span className="clv-command-palette__item-content">
                    <span>{item.label}</span>
                    {item.description ? <small>{item.description}</small> : null}
                  </span>
                  {item.shortcut ? (
                    <kbd aria-label={`Atalho: ${item.shortcut}`}>{item.shortcut}</kbd>
                  ) : null}
                </ListBoxItem>
              ))}
            </ListBox>
          </AriaDialog>
        </Modal>
      </ModalOverlay>
    </>
  );
}
