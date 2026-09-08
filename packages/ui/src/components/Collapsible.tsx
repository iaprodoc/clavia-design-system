import { ChevronDownIcon } from "@clavia-ds/icons";
import { type ReactNode, useId, useState } from "react";

export interface CollapsibleProps {
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
  disabled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  title: ReactNode;
}

/**
 * Revela conteúdo secundário no contexto imediato, sem mudar de rota ou abrir
 * uma sobreposição. Para coleções, o produto compõe instâncias independentes.
 */
export function Collapsible({
  children,
  className,
  defaultOpen = false,
  disabled = false,
  isOpen,
  onOpenChange,
  title,
}: CollapsibleProps) {
  const generatedId = useId();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isOpen ?? internalOpen;
  const triggerId = `${generatedId}-trigger`;
  const contentId = `${generatedId}-content`;
  const classes = ["clv-collapsible", className].filter(Boolean).join(" ");

  function toggle() {
    const nextOpen = !open;

    if (isOpen === undefined) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  }

  return (
    <section
      className={classes}
      data-disabled={disabled || undefined}
      data-state={open ? "open" : "closed"}
    >
      <button
        aria-controls={contentId}
        aria-expanded={open}
        className="clv-collapsible__trigger"
        disabled={disabled}
        id={triggerId}
        onClick={toggle}
        type="button"
      >
        <span className="clv-collapsible__title">{title}</span>
        <ChevronDownIcon aria-hidden="true" className="clv-collapsible__indicator" />
      </button>
      <section
        aria-labelledby={triggerId}
        className="clv-collapsible__content"
        hidden={!open}
        id={contentId}
      >
        {children}
      </section>
    </section>
  );
}
