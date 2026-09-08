// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ArchiveIcon,
  ArrowRightIcon,
  BellIcon,
  BotIcon,
  BuildingIcon,
  CalendarClockIcon,
  CalendarSyncIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  DotsThreeIcon,
  DoubleCheckIcon,
  FileTextIcon,
  GridIcon,
  InfoIcon,
  iconCatalog,
  LockIcon,
  MailIcon,
  MessageCircleIcon,
  PencilIcon,
  QuestionIcon,
  SidebarIcon,
  SignOutIcon,
  SmartphoneIcon,
  TargetIcon,
  TestTubeIcon,
  TriangleAlertIcon,
  UserIcon,
  UsersIcon,
  WhatsAppIcon,
  XIcon,
} from "./index";

describe("ícones da Clavia", () => {
  it("mantém ícones decorativos ocultos de tecnologias assistivas", () => {
    const { container } = render(<ArrowRightIcon />);

    const icon = container.querySelector("svg");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveAttribute("data-icon-source", "phosphor");
    expect(icon).toHaveAttribute("data-icon-weight", "bold");
    expect(icon).toHaveAttribute("fill", "currentColor");
    expect(icon).toHaveAttribute("height", "1em");
    expect(icon).toHaveAttribute("width", "1em");
  });

  it("preserva a compatibilidade de strokeWidth pela escala de pesos aprovada", () => {
    const { container } = render(
      <>
        <CheckIcon data-icon="light" strokeWidth={1.7} />
        <CheckIcon data-icon="regular" strokeWidth={2.2} />
        <CheckIcon data-icon="bold" strokeWidth={2.4} />
      </>,
    );

    expect(container.querySelector('[data-icon="light"]')).toHaveAttribute(
      "data-icon-weight",
      "light",
    );
    expect(container.querySelector('[data-icon="regular"]')).toHaveAttribute(
      "data-icon-weight",
      "regular",
    );
    expect(container.querySelector('[data-icon="bold"]')).toHaveAttribute(
      "data-icon-weight",
      "bold",
    );
  });

  it("expõe um nome acessível quando recebe title", () => {
    render(<CheckIcon title="Confirmado" />);

    expect(screen.getByRole("img", { name: "Confirmado" })).toBeInTheDocument();
  });

  it("gera identificadores únicos para títulos repetidos", () => {
    const { container } = render(
      <>
        <CheckIcon title="Confirmado" />
        <CheckIcon title="Confirmado" />
      </>,
    );

    const icons = container.querySelectorAll("svg");
    expect(icons[0]?.getAttribute("aria-labelledby")).not.toBe(
      icons[1]?.getAttribute("aria-labelledby"),
    );
  });

  it("publica o chevron usado nos campos de seleção", () => {
    const { container } = render(<ChevronDownIcon data-icon="chevron-down" />);

    expect(container.querySelector('[data-icon="chevron-down"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("publica os chevrons direcionais usados em ações", () => {
    const { container } = render(
      <>
        <ChevronLeftIcon data-icon="chevron-left" />
        <ChevronRightIcon data-icon="chevron-right" />
      </>,
    );

    expect(container.querySelector('[data-icon="chevron-left"]')).toBeInTheDocument();
    expect(container.querySelector('[data-icon="chevron-right"]')).toBeInTheDocument();
  });

  it("publica o double-check para ações coletivas de leitura", () => {
    const { container } = render(<DoubleCheckIcon data-icon="double-check" />);

    expect(container.querySelector('[data-icon="double-check"]')).toHaveAttribute(
      "data-icon-source",
      "phosphor",
    );
  });

  it("publica o ícone de overflow para opções secundárias", () => {
    const { container } = render(<DotsThreeIcon data-icon="overflow" />);

    expect(container.querySelector('[data-icon="overflow"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("publica os ícones semânticos do menu de conta", () => {
    const { container } = render(
      <>
        <BellIcon data-icon="notifications" />
        <UserIcon data-icon="profile" />
        <SignOutIcon data-icon="sign-out" />
      </>,
    );

    expect(container.querySelector('[data-icon="notifications"]')).toBeInTheDocument();
    expect(container.querySelector('[data-icon="profile"]')).toBeInTheDocument();
    expect(container.querySelector('[data-icon="sign-out"]')).toBeInTheDocument();
  });

  it("publica o ícone de recolhimento da navegação lateral", () => {
    const { container } = render(<SidebarIcon data-icon="sidebar" />);

    expect(container.querySelector('[data-icon="sidebar"]')).toHaveAttribute(
      "data-icon-source",
      "phosphor",
    );
  });

  it("publica o cadeado usado em estados indisponíveis", () => {
    const { container } = render(<LockIcon data-icon="lock" />);

    expect(container.querySelector('[data-icon="lock"]')).toHaveAttribute("aria-hidden", "true");
  });

  it("publica o e-mail usado para alternar o canal de acesso", () => {
    const { container } = render(<MailIcon data-icon="mail" />);

    expect(container.querySelector('[data-icon="mail"]')).toHaveAttribute("aria-hidden", "true");
  });

  it("publica o smartphone usado para orientar a conexão do canal", () => {
    const { container } = render(<SmartphoneIcon data-icon="smartphone" />);

    expect(container.querySelector('[data-icon="smartphone"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("publica os ícones semânticos usados em alertas", () => {
    const { container } = render(
      <>
        <CircleAlertIcon data-icon="alert-danger" />
        <CircleCheckIcon data-icon="alert-success" />
        <InfoIcon data-icon="alert-info" />
        <TriangleAlertIcon data-icon="alert-warning" />
      </>,
    );

    expect(container.querySelectorAll("[data-icon^=alert]")).toHaveLength(4);
  });

  it("publica o ícone de ajuda contextual", () => {
    const { container } = render(<QuestionIcon data-icon="question" />);

    expect(container.querySelector('[data-icon="question"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("publica a grade usada na fase atual do onboarding", () => {
    const { container } = render(<GridIcon data-icon="grid" />);

    expect(container.querySelector('[data-icon="grid"]')).toHaveAttribute("aria-hidden", "true");
  });

  it("publica o documento usado na fase de formulários", () => {
    const { container } = render(<FileTextIcon data-icon="file-text" />);

    expect(container.querySelector('[data-icon="file-text"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("publica os ícones das fases principais do onboarding", () => {
    const { container } = render(
      <>
        <BuildingIcon data-icon="clinic" />
        <BotIcon data-icon="ai" />
        <TargetIcon data-icon="commercial-process" />
        <TestTubeIcon data-icon="testing" />
        <CalendarClockIcon data-icon="briefing" />
        <CalendarSyncIcon data-icon="shared-calendar" />
        <WhatsAppIcon data-icon="whatsapp" />
        <UsersIcon data-icon="crm" />
      </>,
    );

    expect(container.querySelectorAll("svg")).toHaveLength(8);
    expect(container.querySelector('[data-icon="clinic"]')).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector('[data-icon="ai"]')).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector('[data-icon="commercial-process"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(container.querySelector('[data-icon="testing"]')).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector('[data-icon="briefing"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(container.querySelector('[data-icon="shared-calendar"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(container.querySelector('[data-icon="whatsapp"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(container.querySelector('[data-icon="crm"]')).toHaveAttribute("aria-hidden", "true");
  });

  it("publica o glifo do WhatsApp sem alterar o ícone genérico de conversa", () => {
    const { container } = render(
      <>
        <WhatsAppIcon data-icon="whatsapp-brand" />
        <MessageCircleIcon data-icon="conversation" />
      </>,
    );

    const whatsAppIcon = container.querySelector('[data-icon="whatsapp-brand"]');
    const conversationIcon = container.querySelector('[data-icon="conversation"]');

    expect(whatsAppIcon).toHaveAttribute("fill", "currentColor");
    expect(whatsAppIcon).toHaveAttribute("viewBox", "0 0 19 19");
    expect(whatsAppIcon?.querySelectorAll("path")).toHaveLength(2);
    expect(conversationIcon).toHaveAttribute("data-icon-source", "phosphor");
    expect(conversationIcon).toHaveAttribute("viewBox", "0 0 256 256");
  });

  it("publica ações de edição e remoção pelo catálogo curado", () => {
    const { container } = render(
      <>
        <PencilIcon data-icon="edit" />
        <XIcon data-icon="remove" />
      </>,
    );

    expect(container.querySelector('[data-icon="edit"]')).toHaveAttribute(
      "data-icon-source",
      "phosphor",
    );
    expect(container.querySelector('[data-icon="remove"]')).toHaveAttribute(
      "data-icon-source",
      "phosphor",
    );
  });

  it("publica o ícone de arquivamento para menus de ações", () => {
    const { container } = render(<ArchiveIcon data-icon="archive" />);

    expect(container.querySelector('[data-icon="archive"]')).toHaveAttribute(
      "data-icon-source",
      "phosphor",
    );
  });

  it("mantém o catálogo público completo, único e renderizável", () => {
    const names = iconCatalog.map(({ name }) => name);
    const { container } = render(
      iconCatalog.map(({ component: Icon, name }) => <Icon data-catalog-icon={name} key={name} />),
    );

    expect(iconCatalog).toHaveLength(52);
    expect(new Set(names)).toHaveLength(iconCatalog.length);
    expect(container.querySelectorAll("svg")).toHaveLength(iconCatalog.length);
    expect(iconCatalog.filter(({ source }) => source === "Phosphor")).toHaveLength(51);
    expect(iconCatalog.filter(({ source }) => source === "Clavia")).toHaveLength(1);
    expect(container.querySelector('[data-catalog-icon="LoaderIcon"]')).toHaveAttribute(
      "data-icon-source",
      "phosphor",
    );
    expect(container.querySelector('[data-catalog-icon="SearchIcon"]')).toHaveAttribute(
      "data-icon-source",
      "phosphor",
    );
    expect(container.querySelector('[data-catalog-icon="TrashIcon"]')).toHaveAttribute(
      "data-icon-source",
      "phosphor",
    );
    expect(container.querySelector('[class*="lucide"]')).not.toBeInTheDocument();
  });
});
