import { AppShell } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { HubApplicationShell07 } from "./HubApplicationShell07";

const meta = {
  args: {
    children: null,
  },
  component: AppShell,
  parameters: {
    docs: {
      description: {
        component:
          'Estrutura pública e sem estado para aplicações Clavia. Esta referência lapidada organiza uma Sidebar persistente de 13rem, rail recolhido de 3,5rem, barra superior restrita à área de conteúdo, canvas neutro, ações globais e rodapé institucional. O AppShell é responsável pela área útil, pelo reflow da grade e pelos gutters externos. Com `contentWidth="full"`, a composição inserida deve ocupar `inline-size: 100%` e evitar um `max-inline-size` próprio, para acompanhar o espaço liberado quando a Sidebar recolher. Limites de leitura pertencem aos modos `standard`, `wide` ou a casos intencionais; não duplique o gutter do shell dentro do mesmo nível de layout. O consumidor continua responsável por rotas, permissões e persistência; o conteúdo permanece deliberadamente vazio para documentar o shell sem confundi-lo com uma página de produto.',
      },
    },
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "Componentes/Layout/AppShell",
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão lapidado",
  render: () => <HubApplicationShell07 key="padrao" />,
};

export const SidebarRecolhida: Story = {
  name: "Sidebar recolhida",
  render: () => <HubApplicationShell07 initiallyCollapsed key="sidebar-recolhida" />,
};

export const InteracoesCriticas: Story = {
  name: "Interações críticas",
  render: () => <HubApplicationShell07 key="interacoes-criticas" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("main")).toBeVisible();
    await expect(canvas.getByRole("complementary", { name: "Navegação principal" })).toBeVisible();
    await expect(
      canvas.getByRole("heading", { name: "Área de conteúdo do Hub" }),
    ).toBeInTheDocument();
    const contentSurface = canvasElement.querySelector<HTMLElement>(
      ".clv-application-shell-07__canvas",
    );
    const contentHatch = canvasElement.querySelector<HTMLElement>(
      ".clv-application-shell-07__hatch",
    );
    const contentHeader = canvasElement.querySelector<HTMLElement>(
      ".clv-app-shell__content-header",
    );
    const appShell = canvasElement.querySelector<HTMLElement>(".clv-app-shell");
    const applicationShell = canvasElement.querySelector<HTMLElement>(".clv-application-shell-07");

    expect(contentSurface).not.toBeNull();
    expect(contentHatch).not.toBeNull();
    expect(contentHeader).not.toBeNull();
    expect(appShell).not.toBeNull();
    expect(applicationShell).not.toBeNull();
    if (contentSurface && contentHatch) {
      const surfaceStyles = getComputedStyle(contentSurface);
      const hatchStyles = getComputedStyle(contentHatch);

      expect(surfaceStyles.borderWidth).toBe("0px");
      expect(surfaceStyles.boxShadow).toBe("none");
      expect(hatchStyles.borderWidth).toBe("0px");
      expect(hatchStyles.backgroundImage).toContain("repeating-linear-gradient");
    }
    expect(getComputedStyle(contentHeader as HTMLElement).backgroundColor).toBe(
      "rgb(244, 248, 252)",
    );
    expect(getComputedStyle(appShell as HTMLElement).backgroundColor).toBe("rgb(244, 248, 252)");
    expect(getComputedStyle(applicationShell as HTMLElement).backgroundColor).toBe(
      "rgb(244, 248, 252)",
    );
    await expect(canvas.getByText("Principal")).not.toBeVisible();
    const productLockup = canvas.getByRole("img", { name: "Clavia Hub" });

    await expect(productLockup).toBeVisible();
    expect(getComputedStyle(productLockup).color).toBe("rgb(34, 78, 130)");
    await expect(canvas.queryByRole("img", { name: "Clavia" })).not.toBeInTheDocument();
    const sidebar = canvasElement.querySelector<HTMLElement>(".clv-sidebar");
    const sidebarContent = canvasElement.querySelector<HTMLElement>(".clv-sidebar__content");
    const navigationSurface = sidebar?.closest<HTMLElement>(".clv-app-shell__navigation");

    expect(sidebar).not.toBeNull();
    expect(sidebarContent).not.toBeNull();
    expect(navigationSurface).not.toBeNull();
    expect(sidebar?.getBoundingClientRect().width).toBe(208);
    expect(getComputedStyle(sidebarContent as HTMLElement).backgroundColor).toBe(
      "rgb(244, 248, 252)",
    );
    expect(getComputedStyle(navigationSurface as HTMLElement).backgroundColor).toBe(
      "rgb(244, 248, 252)",
    );
    const notificationBadges = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(".clv-application-shell-07__nav-badge"),
    ).filter((badge) => !badge.closest(".clv-application-shell-07__sub-navigation"));

    expect(notificationBadges).toHaveLength(2);
    for (const badge of notificationBadges) {
      const badgeStyles = getComputedStyle(badge);

      expect(badgeStyles.backgroundColor).toBe("rgb(220, 232, 243)");
      expect(badgeStyles.color).toBe("rgb(2, 24, 38)");
      expect(badgeStyles.fontSize).toBe("10px");
      expect(badgeStyles.fontWeight).toBe("400");
      expect(badgeStyles.marginInlineStart).toBe("8px");
      expect(badgeStyles.minBlockSize).toBe("16px");
      expect(badgeStyles.minInlineSize).toBe("16px");
      expect(badgeStyles.paddingInline).toBe("6px");
    }
    const navigationIcons = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(
        ".clv-nav-item__icon, .clv-application-shell-07__nav-icon",
      ),
    );

    expect(navigationIcons).toHaveLength(11);
    for (const icon of navigationIcons) {
      expect(getComputedStyle(icon).color).toBe("rgb(2, 24, 38)");
      expect(icon.querySelector("svg")).toHaveAttribute("data-icon-weight", "regular");
    }

    const activityGlyph = canvas
      .getByRole("button", { name: "Ver atividade recente" })
      .querySelector("svg");
    const notificationGlyph = canvas
      .getByRole("button", { name: "Ver notificações" })
      .querySelector("svg");
    const notificationDot = canvasElement.querySelector<HTMLElement>(
      ".clv-notification-popover__indicator",
    );
    const accountAvatar = canvas
      .getByRole("button", { name: "Abrir menu de Marina Alves" })
      .querySelector<HTMLElement>(".clv-avatar");

    expect(activityGlyph).not.toBeNull();
    expect(notificationGlyph).not.toBeNull();
    expect(notificationDot).not.toBeNull();
    expect(accountAvatar).not.toBeNull();
    if (activityGlyph && notificationGlyph && notificationDot && accountAvatar) {
      expect(activityGlyph).toHaveAttribute("data-icon-weight", "regular");
      expect(notificationGlyph).toHaveAttribute("data-icon-weight", "regular");
      expect(getComputedStyle(notificationDot).backgroundColor).toBe("rgb(86, 178, 237)");
      const activityRect = activityGlyph.getBoundingClientRect();
      const notificationRect = notificationGlyph.getBoundingClientRect();
      const notificationDotRect = notificationDot.getBoundingClientRect();
      const avatarRect = accountAvatar.getBoundingClientRect();
      const firstVisualGap = notificationRect.left - activityRect.right;
      const secondVisualGap =
        avatarRect.left - Math.max(notificationRect.right, notificationDotRect.right);

      expect(Math.abs(firstVisualGap - secondVisualGap)).toBeLessThanOrEqual(2);
    }
    const notificationTrigger = canvas.getByRole("button", { name: "Ver notificações" });
    await userEvent.click(notificationTrigger);
    const documentBody = within(canvasElement.ownerDocument.body);
    await expect(documentBody.getByRole("dialog", { name: "Notificações" })).toBeVisible();
    await expect(documentBody.getByText("Integração interrompida")).toBeVisible();
    await expect(documentBody.getByText("2 não lidas")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(notificationTrigger).toHaveFocus());
    await expect(canvas.getByRole("link", { name: /Visão geral/ })).toHaveAttribute(
      "aria-current",
      "page",
    );

    const multiwordLabel = canvas.getByText("Pessoas e acessos");
    const multiwordLabelContainer = multiwordLabel.closest<HTMLElement>(".clv-nav-item__label");
    expect(multiwordLabelContainer).not.toBeNull();
    expect(getComputedStyle(multiwordLabel).whiteSpace).toBe("nowrap");
    expect(getComputedStyle(multiwordLabel).overflow).toBe("hidden");

    const resources = canvas.getByRole("button", { name: "Recursos" });
    await expect(resources).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(resources);
    await expect(resources).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByRole("link", { name: "Guias operacionais" })).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Recolher navegação" }));
    await expect(canvas.getByRole("button", { name: "Expandir navegação" })).toBeVisible();
    await expect(canvas.getByRole("img", { name: "Clavia" })).toBeVisible();
    const collapsedLabels = [
      canvas.getByText("Recursos"),
      canvas.getByText("Configurações"),
      multiwordLabelContainer,
    ];
    await waitFor(() => {
      for (const label of collapsedLabels) {
        if (!label) continue;
        expect(getComputedStyle(label).opacity).toBe("0");
        expect(label.getBoundingClientRect().width).toBeLessThanOrEqual(1);
      }
    });
    await waitFor(() => expect(sidebar?.getBoundingClientRect().width).toBe(56));

    const collapsedNavigation = canvas.getByRole("navigation", { name: "Navegação do Hub" });
    const collapsedItems = Array.from(
      collapsedNavigation.querySelectorAll<HTMLElement>(
        ".clv-nav-item, .clv-application-shell-07__disclosure-trigger",
      ),
    ).filter((item) => item.getClientRects().length > 0);
    const horizontalCenters = collapsedItems.map((item) => {
      const rect = item.getBoundingClientRect();
      return rect.left + rect.width / 2;
    });
    const verticalCenters = collapsedItems.map((item) => {
      const rect = item.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });
    const verticalGaps = verticalCenters.slice(1).map((center, index) => {
      const previousCenter = verticalCenters[index];
      return previousCenter === undefined ? 0 : center - previousCenter;
    });

    expect(collapsedItems).toHaveLength(11);
    expect(Math.max(...horizontalCenters) - Math.min(...horizontalCenters)).toBeLessThanOrEqual(1);
    expect(Math.max(...verticalGaps) - Math.min(...verticalGaps)).toBeLessThanOrEqual(1);

    const collapsedSidebarRect = sidebar?.getBoundingClientRect();
    const firstItemCenter = horizontalCenters[0];

    expect(collapsedSidebarRect?.width).toBe(56);
    expect(firstItemCenter).toBeDefined();
    if (collapsedSidebarRect && firstItemCenter !== undefined) {
      expect(firstItemCenter - collapsedSidebarRect.left).toBe(32);
      expect(collapsedSidebarRect.right - firstItemCenter).toBe(24);
    }

    await userEvent.click(canvas.getByRole("button", { name: "Expandir navegação" }));
    await expect(canvas.getByRole("button", { name: "Recolher navegação" })).toBeVisible();
    await waitFor(() => {
      expect(multiwordLabelContainer).not.toBeNull();
      if (multiwordLabelContainer) {
        expect(getComputedStyle(multiwordLabelContainer).opacity).toBe("1");
        expect(multiwordLabelContainer.getBoundingClientRect().width).toBeGreaterThan(1);
      }
    });

    await userEvent.click(canvas.getByRole("button", { name: /Digite para buscar/ }));
    const body = within(canvasElement.ownerDocument.body);
    await expect(body.getByRole("dialog", { name: "Busca rápida no Hub" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
  },
};
