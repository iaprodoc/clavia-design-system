"use client";

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@clavia-ds/icons";
import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  SelectionIndicator as AriaSelectionIndicator,
  type SelectionIndicatorProps as AriaSelectionIndicatorProps,
  Tab as AriaTab,
  TabList as AriaTabList,
  type TabListProps as AriaTabListProps,
  TabPanel as AriaTabPanel,
  type TabPanelProps as AriaTabPanelProps,
  type TabProps as AriaTabProps,
  Tabs as AriaTabs,
  type TabsProps as AriaTabsProps,
} from "react-aria-components";

export interface TabItem {
  ariaLabel?: string;
  content: ReactNode;
  disabled?: boolean;
  id: string;
  label: ReactNode;
}

export type TabsOrientation = "horizontal" | "vertical";
export type TabsVariant = "primary" | "secondary";

type ClassNameOrFunction<T> = string | ((values: T) => string);

function mergeClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function composeClassName<T>(base: string, className?: ClassNameOrFunction<T>) {
  return typeof className === "function"
    ? (values: T) => mergeClasses(base, className(values))
    : mergeClasses(base, className);
}

function scrollTabs(list: HTMLDivElement | null, direction: 1 | -1, orientation: TabsOrientation) {
  if (!list) return;

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const isVertical = orientation === "vertical";
  const size = isVertical ? list.clientHeight : list.clientWidth;
  const maxScroll = Math.max(0, (isVertical ? list.scrollHeight : list.scrollWidth) - size);
  const current = isVertical ? list.scrollTop : list.scrollLeft;
  const isRtl = !isVertical && getComputedStyle(list).direction === "rtl";
  const delta = direction * size * 0.8 * (isRtl ? -1 : 1);
  const next = Math.min(
    isRtl && !isVertical ? 0 : maxScroll,
    Math.max(isRtl && !isVertical ? -maxScroll : 0, current + delta),
  );

  if (next === current) return;
  list.scrollTo({
    behavior: reduceMotion ? "auto" : "smooth",
    ...(isVertical ? { top: next } : { left: next }),
  });
}

interface TabsContextValue {
  nextLabel: string;
  orientation: TabsOrientation;
  previousLabel: string;
}

const TabsContext = createContext<TabsContextValue>({
  nextLabel: "Rolar abas para frente",
  orientation: "horizontal",
  previousLabel: "Rolar abas para trás",
});

interface TabsListContainerContextValue {
  hasOverflow: boolean;
  listId: string;
  setHasOverflow: (hasOverflow: boolean) => void;
}

const TabsListContainerContext = createContext<TabsListContainerContextValue | null>(null);

export interface TabsProps
  extends Omit<
    AriaTabsProps,
    | "children"
    | "className"
    | "defaultSelectedKey"
    | "onSelectionChange"
    | "orientation"
    | "selectedKey"
  > {
  /** Alias compatível da Clavia para `selectedKey`. */
  activeId?: string;
  /** Use `children` para a anatomia composta ou `tabs` para a API de conveniência. */
  children?: ReactNode;
  className?: AriaTabsProps["className"];
  /** Alias compatível da Clavia para `defaultSelectedKey`. */
  defaultActiveId?: string;
  defaultSelectedKey?: AriaTabsProps["defaultSelectedKey"];
  /** Oculta separadores declarados com `Tabs.Separator`. */
  hideSeparator?: boolean;
  /** Nome acessível da lista na API de conveniência. */
  label?: string;
  nextLabel?: string;
  /** Alias compatível da Clavia para `onSelectionChange`. */
  onActiveIdChange?: (id: string) => void;
  onSelectionChange?: AriaTabsProps["onSelectionChange"];
  orientation?: TabsOrientation;
  previousLabel?: string;
  selectedKey?: AriaTabsProps["selectedKey"];
  /** Renderiza separadores entre os itens da API de conveniência. */
  showSeparators?: boolean;
  /** API de conveniência preservada para os consumidores atuais. */
  tabs?: readonly TabItem[];
  variant?: TabsVariant;
}

export interface TabsListContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, "className"> {
  className?: string;
}

export interface TabsListProps<T extends object = object>
  extends Omit<AriaTabListProps<T>, "className"> {
  className?: AriaTabListProps<T>["className"];
}

export interface TabsTabProps extends Omit<AriaTabProps, "className"> {
  className?: AriaTabProps["className"];
}

export interface TabsIndicatorProps extends Omit<AriaSelectionIndicatorProps, "className"> {
  className?: AriaSelectionIndicatorProps["className"];
}

export interface TabsPanelProps extends Omit<AriaTabPanelProps, "className"> {
  className?: AriaTabPanelProps["className"];
}

export interface TabsSeparatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {}

function TabsListContainer({ children, className, ...props }: TabsListContainerProps) {
  const [hasOverflow, setHasOverflow] = useState(false);
  const listId = useId();
  const updateHasOverflow = useCallback((nextHasOverflow: boolean) => {
    setHasOverflow((currentHasOverflow) =>
      currentHasOverflow === nextHasOverflow ? currentHasOverflow : nextHasOverflow,
    );
  }, []);
  const contextValue = useMemo(
    () => ({ hasOverflow, listId, setHasOverflow: updateHasOverflow }),
    [hasOverflow, listId, updateHasOverflow],
  );

  return (
    <TabsListContainerContext.Provider value={contextValue}>
      <div
        {...props}
        className={mergeClasses("clv-tabs__list-container", className)}
        data-overflow={hasOverflow || undefined}
        data-slot="tabs-list-container"
      >
        {children}
      </div>
    </TabsListContainerContext.Provider>
  );
}

function TabsList<T extends object = object>({ className, ...props }: TabsListProps<T>) {
  const { nextLabel, orientation, previousLabel } = useContext(TabsContext);
  const container = useContext(TabsListContainerContext);
  const listRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const listId = container?.listId ?? generatedId;
  const setHasOverflow = container?.setHasOverflow;

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || !setHasOverflow) return;

    let measuredOverflow: boolean | undefined;

    const updateOverflow = () => {
      const hasOverflow =
        orientation === "vertical"
          ? list.scrollHeight > list.clientHeight + 1
          : list.scrollWidth > list.clientWidth + 1;
      if (hasOverflow === measuredOverflow) return;

      measuredOverflow = hasOverflow;
      setHasOverflow(hasOverflow);
    };
    updateOverflow();

    let isActive = true;
    void document.fonts?.ready.then(() => {
      if (isActive) updateOverflow();
    });
    let frameId = window.requestAnimationFrame(() => {
      frameId = window.requestAnimationFrame(updateOverflow);
    });

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateOverflow);
      return () => {
        isActive = false;
        window.cancelAnimationFrame(frameId);
        window.removeEventListener("resize", updateOverflow);
      };
    }

    const observer = new ResizeObserver(updateOverflow);
    observer.observe(list);
    for (const item of list.children) {
      if (item instanceof HTMLElement) observer.observe(item);
    }
    return () => {
      isActive = false;
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [orientation, setHasOverflow]);

  const tabList = (
    <AriaTabList
      {...props}
      className={composeClassName("clv-tabs__list", className)}
      data-slot="tabs-list"
      ref={listRef}
    />
  );

  if (!container) {
    return tabList;
  }

  return (
    <>
      <button
        aria-controls={listId}
        aria-label={previousLabel}
        className="clv-tabs__scroll-control clv-tabs__scroll-control--previous"
        data-slot="tabs-scroll-previous"
        hidden={!container.hasOverflow}
        onClick={() => scrollTabs(listRef.current, -1, orientation)}
        tabIndex={-1}
        type="button"
      >
        {orientation === "vertical" ? (
          <ChevronUpIcon aria-hidden="true" />
        ) : (
          <ChevronLeftIcon aria-hidden="true" />
        )}
      </button>
      <div className="clv-tabs__list-shell" data-slot="tabs-list-scroller" id={listId}>
        {tabList}
      </div>
      <button
        aria-controls={listId}
        aria-label={nextLabel}
        className="clv-tabs__scroll-control clv-tabs__scroll-control--next"
        data-slot="tabs-scroll-next"
        hidden={!container.hasOverflow}
        onClick={() => scrollTabs(listRef.current, 1, orientation)}
        tabIndex={-1}
        type="button"
      >
        {orientation === "vertical" ? (
          <ChevronDownIcon aria-hidden="true" />
        ) : (
          <ChevronRightIcon aria-hidden="true" />
        )}
      </button>
    </>
  );
}

function TabsTab({ className, ...props }: TabsTabProps) {
  return (
    <AriaTab
      {...props}
      className={composeClassName("clv-tabs__tab", className)}
      data-slot="tabs-tab"
    />
  );
}

function TabsIndicator({ className, ...props }: TabsIndicatorProps) {
  return (
    <AriaSelectionIndicator
      {...props}
      className={composeClassName("clv-tabs__indicator", className)}
      data-slot="tabs-indicator"
    />
  );
}

function TabsPanel({ className, ...props }: TabsPanelProps) {
  return (
    <AriaTabPanel
      {...props}
      className={composeClassName("clv-tabs__panel", className)}
      data-slot="tabs-panel"
    />
  );
}

function TabsSeparator({ className, ...props }: TabsSeparatorProps) {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={mergeClasses("clv-tabs__separator", className)}
      data-slot="tabs-separator"
    />
  );
}

function TabsRoot({
  activeId,
  children,
  className,
  defaultActiveId,
  defaultSelectedKey,
  hideSeparator = false,
  label = "Abas",
  nextLabel = "Rolar abas para frente",
  onActiveIdChange,
  onSelectionChange,
  orientation = "horizontal",
  previousLabel = "Rolar abas para trás",
  selectedKey,
  showSeparators = false,
  tabs,
  variant = "primary",
  ...props
}: TabsProps) {
  if (tabs && tabs.length === 0 && children === undefined) {
    return null;
  }

  const fallbackTab = tabs?.find((tab) => !tab.disabled);
  const initialTab =
    tabs?.find((tab) => tab.id === defaultActiveId && !tab.disabled) ?? fallbackTab;
  const resolvedSelectedKey = selectedKey ?? activeId;
  const resolvedDefaultSelectedKey = defaultSelectedKey ?? initialTab?.id;
  const classes = mergeClasses("clv-tabs", `clv-tabs--${variant}`);
  const content =
    children ??
    (tabs ? (
      <>
        <TabsListContainer>
          <TabsList aria-label={label}>
            {tabs.map((tab, index) => (
              <TabsTab
                id={tab.id}
                key={tab.id}
                {...(tab.ariaLabel ? { "aria-label": tab.ariaLabel } : {})}
                {...(tab.disabled ? { isDisabled: true } : {})}
              >
                {showSeparators && index > 0 ? <TabsSeparator /> : null}
                <span className="clv-tabs__label">{tab.label}</span>
                <TabsIndicator />
              </TabsTab>
            ))}
          </TabsList>
        </TabsListContainer>
        {tabs.map((tab) => (
          <TabsPanel id={tab.id} key={tab.id}>
            {tab.content}
          </TabsPanel>
        ))}
      </>
    ) : null);

  return (
    <TabsContext.Provider value={{ nextLabel, orientation, previousLabel }}>
      <AriaTabs
        {...props}
        className={composeClassName(classes, className)}
        data-hide-separator={hideSeparator || undefined}
        data-slot="tabs"
        onSelectionChange={(key) => {
          onSelectionChange?.(key);
          onActiveIdChange?.(String(key));
        }}
        orientation={orientation}
        {...(resolvedDefaultSelectedKey !== undefined
          ? { defaultSelectedKey: resolvedDefaultSelectedKey }
          : {})}
        {...(resolvedSelectedKey !== undefined ? { selectedKey: resolvedSelectedKey } : {})}
      >
        {content}
      </AriaTabs>
    </TabsContext.Provider>
  );
}

export const Tabs = Object.assign(TabsRoot, {
  Indicator: TabsIndicator,
  List: TabsList,
  ListContainer: TabsListContainer,
  Panel: TabsPanel,
  Root: TabsRoot,
  Separator: TabsSeparator,
  Tab: TabsTab,
});
