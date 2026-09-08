import { SidebarIcon } from "@clavia-ds/icons";
import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

import { CloseButton } from "./CloseButton";

export interface SidebarProps {
  children: ReactNode;
  className?: string;
  closeLabel?: string;
  collapseLabel?: string;
  collapsed?: boolean;
  /** Conteúdo exibido no cabeçalho quando a navegação desktop está recolhida. */
  collapsedHeader?: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  /** Texto de apoio exibido abaixo do cabeçalho padrão. */
  description?: ReactNode;
  /** Conteúdo fixo após a região de navegação rolável. */
  footer?: ReactNode;
  /** Substitui o cabeçalho padrão por uma composição de marca ou contexto. */
  header?: ReactNode;
  label?: string;
  onCollapsedChange?: (collapsed: boolean) => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  /** Conteúdo visual do gatilho; o nome acessível continua vindo de triggerLabel. */
  triggerContent?: ReactNode;
  triggerLabel?: string;
  expandLabel?: string;
}

export interface SidebarGroupProps {
  children: ReactNode;
  className?: string;
  label: ReactNode;
}

const compactSidebarQuery = "(max-width: 63.999rem)";

function isCompactViewport() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return true;
  return window.matchMedia(compactSidebarQuery).matches;
}

/** Organiza destinos relacionados dentro da navegação lateral. */
export function SidebarGroup({ children, className, label }: SidebarGroupProps) {
  const labelId = useId();
  const classes = ["clv-sidebar__group", className].filter(Boolean).join(" ");

  return (
    <fieldset aria-labelledby={labelId} className={classes}>
      <legend className="clv-sidebar__group-label" id={labelId}>
        {label}
      </legend>
      <div className="clv-sidebar__group-items">{children}</div>
    </fieldset>
  );
}

export function Sidebar({
  children,
  className,
  closeLabel = "Fechar navegação",
  collapseLabel = "Recolher navegação",
  collapsed: controlledCollapsed,
  collapsedHeader,
  collapsible = true,
  defaultCollapsed = false,
  description,
  expandLabel = "Expandir navegação",
  footer,
  header,
  label = "Navegação principal",
  onCollapsedChange,
  onOpenChange,
  open: controlledOpen,
  triggerContent,
  triggerLabel = "Abrir navegação",
}: SidebarProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [uncontrolledCollapsed, setUncontrolledCollapsed] = useState(defaultCollapsed);
  const contentId = useId();
  const contentRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isControlled = controlledOpen !== undefined;
  const isCollapsedControlled = controlledCollapsed !== undefined;
  const open = controlledOpen ?? uncontrolledOpen;
  const collapsed = controlledCollapsed ?? uncontrolledCollapsed;

  const setOpen = (nextOpen: boolean) => {
    if (!isControlled) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const openNavigation = () => setOpen(true);
  const toggleCollapsed = () => {
    const nextCollapsed = !collapsed;
    if (!isCollapsedControlled) setUncontrolledCollapsed(nextCollapsed);
    onCollapsedChange?.(nextCollapsed);
  };
  const closeNavigation = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };
  const focusNavigation = () =>
    requestAnimationFrame(() => {
      contentRef.current?.focus();
    });

  useEffect(() => {
    if (open && isCompactViewport()) contentRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open || !isCompactViewport()) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const classes = ["clv-sidebar", className].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      data-collapsed={collapsible && collapsed ? "true" : "false"}
      data-open={open ? "true" : "false"}
    >
      <button
        aria-controls={contentId}
        aria-expanded={open}
        aria-label={triggerLabel}
        className="clv-sidebar__trigger"
        onClick={openNavigation}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openNavigation();
          }
        }}
        onKeyUp={(event) => {
          if (event.key === "Enter" || event.key === " ") focusNavigation();
        }}
        ref={triggerRef}
        type="button"
      >
        {triggerContent ?? triggerLabel}
      </button>
      <div
        aria-hidden="true"
        className="clv-sidebar__backdrop"
        onClick={closeNavigation}
        role="presentation"
      />
      <aside
        className="clv-sidebar__content"
        id={contentId}
        onKeyDown={(event) => {
          const compactTriggerIsVisible =
            triggerRef.current && getComputedStyle(triggerRef.current).display !== "none";

          if (event.key === "Escape" && open && compactTriggerIsVisible) {
            event.preventDefault();
            event.stopPropagation();
            closeNavigation();
            return;
          }

          if (event.key === "Tab" && open && compactTriggerIsVisible) {
            const focusable = Array.from(
              contentRef.current?.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
              ) ?? [],
            );
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (!first || !last) return;
            if (!event.shiftKey && document.activeElement === contentRef.current) {
              event.preventDefault();
              first.focus();
            } else if (event.shiftKey && document.activeElement === contentRef.current) {
              event.preventDefault();
              last.focus();
            } else if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
        }}
        ref={contentRef}
        tabIndex={-1}
      >
        <div className="clv-sidebar__header">
          <div className="clv-sidebar__heading clv-sidebar__heading--expanded">
            {header ?? (
              <>
                <strong className="clv-sidebar__title">{label}</strong>
                {description ? (
                  <span className="clv-sidebar__description">{description}</span>
                ) : null}
              </>
            )}
          </div>
          {collapsedHeader ? (
            <div className="clv-sidebar__heading clv-sidebar__heading--collapsed">
              {collapsedHeader}
            </div>
          ) : null}
          <CloseButton
            className="clv-sidebar__close"
            label={closeLabel}
            onClick={closeNavigation}
            size="md"
          />
          {collapsible ? (
            <button
              aria-controls={contentId}
              aria-expanded={!collapsed}
              aria-label={collapsed ? expandLabel : collapseLabel}
              className="clv-sidebar__collapse"
              onClick={toggleCollapsed}
              type="button"
            >
              <SidebarIcon aria-hidden="true" />
            </button>
          ) : null}
        </div>
        <nav aria-label={label} className="clv-sidebar__navigation">
          {children}
        </nav>
        {footer ? <div className="clv-sidebar__footer">{footer}</div> : null}
      </aside>
    </div>
  );
}
