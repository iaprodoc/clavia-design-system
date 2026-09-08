import type { ReactNode } from "react";

export type AppShellContentWidth = "standard" | "wide" | "full";

export interface AppShellProps {
  className?: string;
  children: ReactNode;
  /** Rodapé da área de conteúdo. Permanece alinhado ao main quando existe navegação lateral. */
  contentFooter?: ReactNode;
  /** Cabeçalho interno alinhado ao mesmo container e largura da área principal. */
  contentHeader?: ReactNode;
  /**
   * Controla a largura do cabeçalho interno, do conteúdo principal e do rodapé interno.
   * Em `full`, filhos devem ser fluidos e evitar um `max-inline-size` próprio quando precisarem
   * acompanhar o espaço liberado pela navegação lateral.
   */
  contentWidth?: AppShellContentWidth;
  footer?: ReactNode;
  header?: ReactNode;
  /** Conteúdo persistente de navegação, normalmente composto por NavItem. */
  navigation?: ReactNode;
  navigationLabel?: string;
  /** Segunda região lateral para contexto local, como canais, pastas ou seções. */
  secondaryNavigation?: ReactNode;
  secondaryNavigationLabel?: string;
}

export function AppShell({
  children,
  className,
  contentFooter,
  contentHeader,
  contentWidth = "standard",
  footer,
  header,
  navigation,
  navigationLabel = "Navegação principal",
  secondaryNavigation,
  secondaryNavigationLabel = "Navegação contextual",
}: AppShellProps) {
  return (
    <div
      className={["clv-app-shell", className].filter(Boolean).join(" ")}
      data-content-width={contentWidth}
    >
      {header ? <header className="clv-app-shell__header">{header}</header> : null}
      <div className="clv-app-shell__body" data-has-navigation={navigation ? "true" : "false"}>
        {navigation ? (
          <aside aria-label={navigationLabel} className="clv-app-shell__navigation">
            {navigation}
          </aside>
        ) : null}
        <div className="clv-app-shell__workspace">
          {contentHeader ? (
            <div className="clv-app-shell__content-header">{contentHeader}</div>
          ) : null}
          <div
            className="clv-app-shell__workspace-body"
            data-has-secondary-navigation={secondaryNavigation ? "true" : "false"}
          >
            {secondaryNavigation ? (
              <aside
                aria-label={secondaryNavigationLabel}
                className="clv-app-shell__secondary-navigation"
              >
                {secondaryNavigation}
              </aside>
            ) : null}
            <main className="clv-app-shell__content">
              <div className="clv-app-shell__container">{children}</div>
            </main>
          </div>
          {contentFooter ? (
            <div className="clv-app-shell__content-footer">{contentFooter}</div>
          ) : null}
        </div>
      </div>
      {footer ? <footer className="clv-app-shell__footer">{footer}</footer> : null}
    </div>
  );
}
