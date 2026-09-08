import {
  CalendarIcon,
  ChevronDownIcon,
  ClockIcon,
  FileTextIcon,
  GridIcon,
  MessageCircleIcon,
  PencilIcon,
  QuestionIcon,
  SearchIcon,
  SidebarIcon,
  TrendingUpIcon,
  UserIcon,
  WrenchIcon,
} from "@clavia-ds/icons";
import {
  AppShell,
  ClaviaIcon,
  ClaviaProductLockup,
  CommandPalette,
  IconButton,
  NavItem,
  NotificationPopover,
  Sidebar,
  SidebarGroup,
  UserAccountPopover,
} from "@clavia-ds/ui";
import type { ReactNode } from "react";
import { useId, useState } from "react";

import { hubNotificationItems } from "../navigation/notification-fixtures";
import "./app-shell.css";

type NavigationItemProps = {
  badge?: string;
  current?: boolean;
  href: string;
  icon: ReactNode;
  label: string;
};

type NavigationDisclosureProps = {
  icon: ReactNode;
  items: Array<{ badge?: string; label: string }>;
  label: string;
};

const quickActions = [
  {
    description: "Acompanhe o resumo da operação.",
    group: "Navegação",
    id: "visao-geral",
    keywords: ["painel", "operação"],
    label: "Abrir visão geral",
  },
  {
    description: "Consulte membros, convites e permissões.",
    group: "Navegação",
    id: "pessoas",
    keywords: ["equipe", "acessos"],
    label: "Abrir pessoas e acessos",
  },
  {
    description: "Veja decisões e alterações recentes.",
    group: "Ações",
    id: "atividade",
    keywords: ["histórico", "eventos"],
    label: "Ver atividade recente",
  },
] as const;

function NavigationItem({ badge, current, href, icon, label }: NavigationItemProps) {
  return (
    <NavItem {...(current === undefined ? {} : { current })} href={href} icon={icon}>
      <span className="clv-application-shell-07__nav-label">{label}</span>
      {badge ? <span className="clv-application-shell-07__nav-badge">{badge}</span> : null}
    </NavItem>
  );
}

function NavigationDisclosure({ icon, items, label }: NavigationDisclosureProps) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="clv-application-shell-07__disclosure" data-open={open ? "true" : "false"}>
      <button
        aria-controls={contentId}
        aria-expanded={open}
        aria-label={label}
        className="clv-application-shell-07__disclosure-trigger"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span aria-hidden="true" className="clv-application-shell-07__nav-icon">
          {icon}
        </span>
        <span className="clv-application-shell-07__nav-label">{label}</span>
        <ChevronDownIcon
          aria-hidden="true"
          className="clv-application-shell-07__disclosure-indicator"
        />
      </button>
      <div className="clv-application-shell-07__sub-navigation" hidden={!open} id={contentId}>
        {items.map((item) => (
          <NavItem
            href={`#${item.label.toLocaleLowerCase().replaceAll(" ", "-")}`}
            key={item.label}
          >
            <span className="clv-application-shell-07__nav-label">{item.label}</span>
            {item.badge ? (
              <span className="clv-application-shell-07__nav-badge">{item.badge}</span>
            ) : null}
          </NavItem>
        ))}
      </div>
    </div>
  );
}

function BrandMark() {
  return (
    <span aria-label="Clavia" className="clv-application-shell-07__brand-mark" role="img">
      <ClaviaIcon aria-hidden size={36} />
    </span>
  );
}

function ShellNavigation({
  collapsed,
  onCollapsedChange,
  onOpenChange,
  open,
}: {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  return (
    <Sidebar
      className="clv-application-shell-07__sidebar"
      collapsed={collapsed}
      collapsedHeader={<BrandMark />}
      header={<ClaviaProductLockup solution="Hub" tone="secondary" />}
      label="Navegação do Hub"
      onCollapsedChange={onCollapsedChange}
      onOpenChange={onOpenChange}
      open={open}
    >
      <SidebarGroup className="clv-application-shell-07__primary-group" label="Principal">
        <NavigationItem
          badge="3"
          current
          href="#visao-geral"
          icon={<GridIcon strokeWidth={2.2} />}
          label="Visão geral"
        />
      </SidebarGroup>
      <SidebarGroup label="Páginas">
        <NavigationItem
          href="#pessoas"
          icon={<UserIcon strokeWidth={2.2} />}
          label="Pessoas e acessos"
        />
        <NavigationItem
          href="#progresso"
          icon={<TrendingUpIcon strokeWidth={2.2} />}
          label="Progresso"
        />
        <NavigationItem
          badge="2"
          href="#pendencias"
          icon={<PencilIcon strokeWidth={2.2} />}
          label="Pendências"
        />
        <NavigationItem href="#agenda" icon={<ClockIcon strokeWidth={2.2} />} label="Agenda" />
        <NavigationDisclosure
          icon={<FileTextIcon strokeWidth={2.2} />}
          items={[
            { label: "Guias operacionais" },
            { label: "Modelos aprovados" },
            { badge: "5", label: "Leituras adicionais" },
          ]}
          label="Recursos"
        />
        <NavigationItem
          href="#relatorios"
          icon={<FileTextIcon strokeWidth={2.2} />}
          label="Relatórios"
        />
        <NavigationItem
          href="#certificados"
          icon={<CalendarIcon strokeWidth={2.2} />}
          label="Certificados"
        />
      </SidebarGroup>
      <SidebarGroup label="Outros">
        <NavigationItem
          href="#avaliacoes"
          icon={<MessageCircleIcon strokeWidth={2.2} />}
          label="Avaliações"
        />
        <NavigationItem href="#ajuda" icon={<QuestionIcon strokeWidth={2.2} />} label="Ajuda" />
        <NavigationDisclosure
          icon={<WrenchIcon strokeWidth={2.2} />}
          items={[{ label: "Perfil" }, { label: "Preferências gerais" }]}
          label="Configurações"
        />
      </SidebarGroup>
    </Sidebar>
  );
}

function ContentHeader({
  collapsed,
  onNavigationToggle,
}: {
  collapsed: boolean;
  onNavigationToggle: () => void;
}) {
  return (
    <div className="clv-application-shell-07__header">
      <div className="clv-application-shell-07__header-start">
        <IconButton
          className="clv-application-shell-07__ghost-action"
          label={collapsed ? "Expandir navegação" : "Recolher navegação"}
          onClick={onNavigationToggle}
          size="sm"
        >
          <SidebarIcon strokeWidth={2.2} />
        </IconButton>
        <span aria-hidden="true" className="clv-application-shell-07__separator" />
        <CommandPalette
          items={quickActions}
          label="Busca rápida no Hub"
          trigger={
            <span className="clv-application-shell-07__search-trigger">
              <SearchIcon aria-hidden="true" strokeWidth={2.2} />
              <span>Digite para buscar...</span>
            </span>
          }
          triggerVariant="compact"
        />
      </div>
      <div className="clv-application-shell-07__header-actions">
        <IconButton
          className="clv-application-shell-07__ghost-action"
          label="Ver atividade recente"
          size="sm"
        >
          <TrendingUpIcon strokeWidth={2.2} />
        </IconButton>
        <NotificationPopover items={hubNotificationItems} />
        <UserAccountPopover
          avatarInitials="MA"
          avatarSize="sm"
          email="marina.alves@exemplo.com"
          items={[
            { icon: <UserIcon />, id: "profile", label: "Meu perfil" },
            { icon: <WrenchIcon />, id: "settings", label: "Configurações" },
          ]}
          label="Opções da conta de Marina Alves"
          name="Marina Alves"
        />
      </div>
    </div>
  );
}

function ContentPlaceholder() {
  return (
    <section
      aria-labelledby="application-shell-07-content-title"
      className="clv-application-shell-07__canvas"
    >
      <h1 className="clv-application-shell-07__sr-only" id="application-shell-07-content-title">
        Área de conteúdo do Hub
      </h1>
      <div aria-hidden="true" className="clv-application-shell-07__hatch" />
    </section>
  );
}

function ContentFooter() {
  return (
    <div className="clv-application-shell-07__content-footer">
      <p>
        ©{new Date().getFullYear()} <a href="#clavia">Clavia</a>, exemplo de composição.
      </p>
      <nav aria-label="Links institucionais">
        <a href="#licenca">Licença</a>
        <a href="#temas">Temas</a>
        <a href="#documentacao">Documentação</a>
        <a href="#suporte">Suporte</a>
      </nav>
    </div>
  );
}

export function HubApplicationShell07({
  children,
  initiallyCollapsed = false,
}: {
  children?: ReactNode;
  initiallyCollapsed?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(initiallyCollapsed);
  const [open, setOpen] = useState(false);

  const toggleNavigation = () => {
    if (window.matchMedia("(max-width: 63.999rem)").matches) {
      setOpen(true);
      return;
    }

    setCollapsed((current) => !current);
  };

  return (
    <div className="clv-application-shell-07">
      <AppShell
        contentFooter={<ContentFooter />}
        contentHeader={
          <ContentHeader collapsed={collapsed} onNavigationToggle={toggleNavigation} />
        }
        contentWidth="full"
        navigation={
          <ShellNavigation
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            onOpenChange={setOpen}
            open={open}
          />
        }
      >
        {children ? (
          <div className="clv-application-shell-07__canvas clv-application-shell-07__canvas--composition">
            {children}
          </div>
        ) : (
          <ContentPlaceholder />
        )}
      </AppShell>
    </div>
  );
}
