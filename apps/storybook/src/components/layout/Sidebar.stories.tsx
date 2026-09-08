import {
  BuildingIcon,
  CalendarIcon,
  FileTextIcon,
  GridIcon,
  SearchIcon,
  UsersIcon,
  WrenchIcon,
} from "@clavia-ds/icons";
import { ClaviaIcon, IconButton, NavItem, SearchField, Sidebar, SidebarGroup } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import "./sidebar.css";

function NavigationItems({ extended = false }: { extended?: boolean }) {
  return (
    <>
      <SidebarGroup label="Principal">
        <NavItem current href="#visao-geral" icon={<GridIcon />}>
          Visão geral
        </NavItem>
        <NavItem href="#pessoas" icon={<UsersIcon />}>
          Pessoas e acessos
        </NavItem>
        <NavItem href="#documentos" icon={<FileTextIcon />}>
          Documentos
        </NavItem>
      </SidebarGroup>
      <SidebarGroup label="Operação">
        <NavItem href="#agenda" icon={<CalendarIcon />}>
          Agenda
        </NavItem>
        <NavItem href="#unidades" icon={<BuildingIcon />}>
          Unidades
        </NavItem>
        <NavItem href="#configuracoes" icon={<WrenchIcon />}>
          Configurações
        </NavItem>
      </SidebarGroup>
      {extended
        ? ["Área 1", "Área 2", "Área 3", "Área 4"].map((area, index) => (
            <SidebarGroup key={area} label={area}>
              <NavItem href={`#equipe-${index}`} icon={<UsersIcon />}>
                Equipe
              </NavItem>
              <NavItem href={`#arquivos-${index}`} icon={<FileTextIcon />}>
                Arquivos
              </NavItem>
              <NavItem href={`#preferencias-${index}`} icon={<WrenchIcon />}>
                Preferências
              </NavItem>
            </SidebarGroup>
          ))
        : null}
    </>
  );
}

function SidebarBrand() {
  return (
    <div className="clv-story-sidebar-brand">
      <ClaviaIcon aria-hidden size={24} />
      <span>Clavia</span>
    </div>
  );
}

function SidebarCollapsedBrand() {
  return <ClaviaIcon aria-hidden size={24} />;
}

function SidebarFooter() {
  return (
    <button className="clv-story-sidebar-account" type="button">
      <span aria-hidden="true" className="clv-story-sidebar-avatar">
        HC
      </span>
      <span>
        <strong>Helena Costa</strong>
        <small>Administradora</small>
      </span>
    </button>
  );
}

function ControlledSidebarExample() {
  const [open, setOpen] = useState(false);

  return (
    <Sidebar
      footer={<SidebarFooter />}
      header={<SidebarBrand />}
      collapsedHeader={<SidebarCollapsedBrand />}
      onOpenChange={setOpen}
      open={open}
      triggerContent={<GridIcon />}
    >
      <NavigationItems />
    </Sidebar>
  );
}

function SidebarLayoutExample() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="clv-story-sidebar-layout">
      <Sidebar
        className="clv-story-sidebar-layout__sidebar"
        collapsed={collapsed}
        collapsedHeader={<SidebarCollapsedBrand />}
        footer={<SidebarFooter />}
        header={<SidebarBrand />}
        onCollapsedChange={setCollapsed}
        onOpenChange={setOpen}
        open={open}
        triggerContent={<GridIcon />}
      >
        <NavigationItems extended />
      </Sidebar>
      <div className="clv-story-sidebar-layout__workspace">
        <header className="clv-story-sidebar-layout__toolbar">
          <SearchField
            className="clv-story-sidebar-layout__search"
            onChange={setSearch}
            placeholder="Buscar"
            value={search}
          />
          <IconButton label="Buscar" size="sm">
            <SearchIcon />
          </IconButton>
          <span className="clv-story-sidebar-layout__toolbar-spacer" />
          <button className="clv-story-sidebar-account-button" type="button">
            Minha conta
          </button>
        </header>
        <main className="clv-story-sidebar-layout__main">
          <div>
            <h1>Visão geral</h1>
            <p>Acompanhe prioridades e movimentações recentes da operação.</p>
          </div>
          <section className="clv-story-sidebar-layout__metrics" aria-label="Resumo da operação">
            {[
              ["Em andamento", "18"],
              ["Concluídas", "47"],
              ["Pedem atenção", "6"],
              ["Novos clientes", "12"],
            ].map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </section>
          <div className="clv-story-sidebar-layout__panels" aria-hidden="true">
            <div />
            <div />
          </div>
        </main>
      </div>
    </div>
  );
}

const meta = {
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Navegação lateral com cabeçalho fixo, grupos semânticos, corpo rolável e rodapé opcional. Em telas amplas, permanece sticky e pode ser recolhida para um rail de ícones; `collapsedHeader` mantém a marca reconhecível nesse estado. A largura e a coluna do shell se movem juntas, enquanto rótulos de uma ou mais palavras permanecem em uma linha e aparecem na segunda metade da expansão. No compacto, torna-se um drawer com backdrop, transição, bloqueio da rolagem da página, foco contido e retorno ao gatilho.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Layout/Sidebar",
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  args: {
    children: <NavigationItems />,
    footer: <SidebarFooter />,
    header: <SidebarBrand />,
    collapsedHeader: <SidebarCollapsedBrand />,
    triggerContent: <GridIcon />,
  },
};

export const ComMarca: Story = {
  args: {
    children: <NavigationItems />,
    footer: <SidebarFooter />,
    header: <SidebarBrand />,
    collapsedHeader: <SidebarCollapsedBrand />,
    triggerContent: <GridIcon />,
  },
  name: "Com marca e conta",
  play: async ({ canvas, canvasElement }) => {
    const brand = canvasElement.querySelector<HTMLElement>(".clv-story-sidebar-brand");
    if (!brand) throw new Error("Assinatura da Sidebar não encontrada.");

    await expect(canvas.getByText("Clavia")).toBeVisible();
    await expect(brand.querySelector(".clv-icon")).toHaveAttribute("aria-hidden", "true");
    await expect(getComputedStyle(brand).display).toBe("flex");
    await expect(getComputedStyle(brand.querySelector(".clv-icon") as SVGElement).inlineSize).toBe(
      "24px",
    );
    await expect(getComputedStyle(canvas.getByText("Clavia")).fontFamily).toContain("Sora");
    await expect(getComputedStyle(canvas.getByText("Clavia")).fontWeight).toBe("500");
  },
};

export const Recolhida: Story = {
  args: {
    children: <NavigationItems />,
    collapsedHeader: <SidebarCollapsedBrand />,
    defaultCollapsed: true,
    footer: <SidebarFooter />,
    header: <SidebarBrand />,
    triggerContent: <GridIcon />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "No desktop, reduz a navegação ao rail de ícones e mantém somente o símbolo da Clavia no cabeçalho. O controle de expansão reaparece por hover ou foco.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const content = canvasElement.querySelector<HTMLElement>(".clv-sidebar__content");

    if (!content) throw new Error("Conteúdo da Sidebar não encontrado.");

    await expect(content.getBoundingClientRect().top).toBe(0);
  },
};

export const Interacoes: Story = {
  args: {
    children: <NavigationItems />,
    footer: <SidebarFooter />,
    triggerContent: <GridIcon />,
  },
  name: "Interações críticas",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvasElement.querySelector<HTMLButtonElement>(".clv-sidebar__trigger");
    const navigation = canvas.getByRole("navigation", { name: "Navegação principal" });

    if (!trigger) throw new Error("Gatilho da Sidebar não encontrado.");

    if (window.innerWidth < 1024) {
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await waitFor(() =>
        expect(canvasElement.querySelector(".clv-sidebar__content")).toHaveFocus(),
      );
      await expect(canvasElement.querySelector(".clv-sidebar__backdrop")).toBeVisible();
      await expect(getComputedStyle(navigation).overflowY).toBe("auto");
      await userEvent.keyboard("{Escape}");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveFocus();
    } else {
      await expect(navigation).toBeVisible();
    }
  },
};

export const EstadoControlado: Story = {
  args: { children: null },
  render: () => <ControlledSidebarExample />,
};

export const ConteudoExtenso: Story = {
  args: {
    children: <NavigationItems extended />,
    footer: <SidebarFooter />,
    header: <SidebarBrand />,
    collapsedHeader: <SidebarCollapsedBrand />,
    triggerContent: <GridIcon />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvasElement.querySelector<HTMLButtonElement>(".clv-sidebar__trigger");
    const sidebarRoot = canvasElement.querySelector<HTMLElement>(".clv-sidebar");
    const collapsedHeading = canvasElement.querySelector<HTMLElement>(
      ".clv-sidebar__heading--collapsed",
    );

    if (!trigger) throw new Error("Gatilho da Sidebar não encontrado.");

    if (window.innerWidth < 1024) await userEvent.click(trigger);

    const navigation = canvas.getByRole("navigation", { name: "Navegação principal" });
    await expect(getComputedStyle(navigation).overflowY).toBe("auto");
    await expect(getComputedStyle(navigation).scrollbarWidth).toBe("none");
    await expect(canvas.getAllByRole("link", { name: "Preferências" })[0]).toBeVisible();

    if (window.innerWidth >= 1024) {
      await expect(getComputedStyle(sidebarRoot as HTMLElement).inlineSize).toBe("280px");
      await expect(collapsedHeading).not.toBeVisible();
    }
  },
};

export const SidebarLayout: Story = {
  args: { children: null },
  name: "Sidebar layout",
  parameters: { layout: "fullscreen" },
  render: () => <SidebarLayoutExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sidebar = canvasElement.querySelector<HTMLElement>(".clv-sidebar__content");
    const sidebarHeader = canvasElement.querySelector<HTMLElement>(".clv-sidebar__header");
    const sidebarFooter = canvasElement.querySelector<HTMLElement>(".clv-sidebar__footer");
    const toolbar = canvasElement.querySelector<HTMLElement>(".clv-story-sidebar-layout__toolbar");
    const sidebarRoot = canvasElement.querySelector<HTMLElement>(".clv-sidebar");
    const multiwordLabel = canvas.getByText("Pessoas e acessos");
    await expect(canvas.getByRole("heading", { name: "Visão geral" })).toBeVisible();
    await expect(canvas.getByRole("navigation", { name: "Navegação principal" })).toBeVisible();
    await expect(getComputedStyle(sidebar as HTMLElement).boxShadow).toBe("none");
    await expect(getComputedStyle(sidebar as HTMLElement).borderInlineEndWidth).toBe("0px");
    await expect(getComputedStyle(sidebarHeader as HTMLElement).borderBlockEndWidth).toBe("0px");
    await expect(getComputedStyle(sidebarFooter as HTMLElement).borderBlockStartWidth).toBe("0px");
    await expect(getComputedStyle(toolbar as HTMLElement).borderBlockEndWidth).toBe("0px");
    await expect(getComputedStyle(multiwordLabel).whiteSpace).toBe("nowrap");
    await expect(getComputedStyle(multiwordLabel.parentElement as HTMLElement).overflow).toBe(
      "hidden",
    );

    if (window.innerWidth >= 1024) {
      const collapseButton = canvas.getByRole("button", { name: "Recolher navegação" });
      await userEvent.click(collapseButton);
      await expect(sidebarRoot).toHaveAttribute("data-collapsed", "true");
      const expandButton = canvas.getByRole("button", { name: "Expandir navegação" });
      await expect(expandButton).toHaveAttribute("aria-expanded", "false");
      await waitFor(() =>
        expect(getComputedStyle(sidebarRoot as HTMLElement).inlineSize).toBe("72px"),
      );
      await expect(getComputedStyle(sidebarRoot as HTMLElement).transitionDuration).toBe("0.18s");
      await expect(multiwordLabel).not.toBeVisible();
      await expect(canvas.getByText("Clavia")).not.toBeVisible();
      await expect(
        canvasElement.querySelector(".clv-sidebar__heading--collapsed .clv-icon"),
      ).toBeVisible();
      await expect(
        getComputedStyle(
          canvasElement.querySelector(".clv-sidebar__heading--collapsed .clv-icon") as SVGElement,
        ).inlineSize,
      ).toBe("28px");
      await userEvent.hover(sidebarHeader as HTMLElement);
      await expect(expandButton).toBeVisible();
    }
  },
};
