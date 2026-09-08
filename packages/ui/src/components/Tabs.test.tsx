import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Tabs } from "./Tabs";

describe("Tabs", () => {
  it("troca a aba ativa com as setas do teclado", () => {
    render(
      <Tabs
        label="Configurações"
        tabs={[
          { content: "Conteúdo geral", id: "geral", label: "Geral" },
          { content: "Conteúdo de agenda", id: "agenda", label: "Agenda" },
        ]}
      />,
    );

    const geral = screen.getByRole("tab", { name: "Geral" });
    fireEvent.keyDown(geral, { key: "ArrowRight" });

    expect(screen.getByRole("tab", { name: "Agenda" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Conteúdo de agenda");
  });

  it("ignora abas desabilitadas durante a navegação", () => {
    render(
      <Tabs
        label="Configurações"
        tabs={[
          { content: "Conteúdo geral", id: "geral", label: "Geral" },
          { content: "Sem acesso", disabled: true, id: "restrita", label: "Restrita" },
          { content: "Conteúdo de agenda", id: "agenda", label: "Agenda" },
        ]}
      />,
    );

    fireEvent.keyDown(screen.getByRole("tab", { name: "Geral" }), { key: "ArrowRight" });

    expect(screen.getByRole("tab", { name: "Agenda" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Restrita" })).toHaveAttribute("aria-disabled", "true");
  });

  it("aceita seleção controlada e comunica a alteração", () => {
    const handleActiveIdChange = vi.fn();

    render(
      <Tabs
        activeId="geral"
        label="Configurações"
        onActiveIdChange={handleActiveIdChange}
        tabs={[
          { content: "Conteúdo geral", id: "geral", label: "Geral" },
          { content: "Conteúdo de agenda", id: "agenda", label: "Agenda" },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Agenda" }));

    expect(handleActiveIdChange).toHaveBeenCalledWith("agenda");
    expect(screen.getByRole("tab", { name: "Geral" })).toHaveAttribute("aria-selected", "true");
  });

  it("usa as setas verticais quando a orientação é vertical", () => {
    render(
      <Tabs
        label="Configurações"
        orientation="vertical"
        tabs={[
          { content: "Conteúdo geral", id: "geral", label: "Geral" },
          { content: "Conteúdo de agenda", id: "agenda", label: "Agenda" },
        ]}
      />,
    );

    fireEvent.keyDown(screen.getByRole("tab", { name: "Geral" }), { key: "ArrowDown" });

    expect(screen.getByRole("tab", { name: "Agenda" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
    expect(document.querySelector(".clv-tabs__scroll-control--previous svg")).toBeTruthy();
  });

  it("nomeia os controles de overflow e associa o trilho por aria-controls", () => {
    render(
      <Tabs
        label="Seções"
        nextLabel="Avançar seções"
        previousLabel="Voltar seções"
        tabs={[{ content: "Conteúdo", id: "geral", label: "Geral" }]}
      />,
    );

    const tabList = screen.getByRole("tablist", { name: "Seções" });
    const listShell = tabList.parentElement;

    expect(listShell).toHaveAttribute("id");
    expect(document.querySelector('[aria-label="Voltar seções"]')).toHaveAttribute(
      "aria-controls",
      listShell?.id,
    );
    expect(document.querySelector('[aria-label="Avançar seções"]')).toHaveAttribute(
      "aria-controls",
      listShell?.id,
    );
  });

  it("preserva a observação de overflow quando o conteúdo pai renderiza novamente", () => {
    const disconnect = vi.fn();
    const observe = vi.fn();
    const ResizeObserverMock = vi.fn(function ResizeObserverMock() {
      return { disconnect, observe, unobserve: vi.fn() };
    });
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);

    const { rerender } = render(
      <Tabs label="Seções" tabs={[{ content: "Conteúdo", id: "geral", label: "Geral" }]} />,
    );

    rerender(<Tabs label="Seções" tabs={[{ content: "Conteúdo", id: "geral", label: "Geral" }]} />);

    expect(ResizeObserverMock).toHaveBeenCalledTimes(1);
    expect(observe).toHaveBeenCalled();
    expect(disconnect).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("expõe a anatomia composta com slots, separador e painel correspondente", () => {
    render(
      <Tabs defaultSelectedKey="geral" showSeparators>
        <Tabs.ListContainer data-testid="container">
          <Tabs.List aria-label="Configurações compostas">
            <Tabs.Tab id="geral">
              Geral
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="agenda">
              <Tabs.Separator data-testid="separator" />
              Agenda
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel id="geral">Conteúdo geral</Tabs.Panel>
        <Tabs.Panel id="agenda">Conteúdo de agenda</Tabs.Panel>
      </Tabs>,
    );

    expect(document.querySelector('[data-slot="tabs"]')).toHaveClass("clv-tabs--primary");
    expect(screen.getByTestId("container")).toHaveAttribute("data-slot", "tabs-list-container");
    expect(screen.getByTestId("separator")).toHaveAttribute("aria-hidden", "true");

    fireEvent.click(screen.getByRole("tab", { name: "Agenda" }));

    expect(screen.getByRole("tab", { name: "Agenda" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Conteúdo de agenda");
  });

  it("aceita as propriedades canônicas de seleção sem remover os aliases da Clavia", () => {
    const onSelectionChange = vi.fn();
    const onActiveIdChange = vi.fn();

    render(
      <Tabs
        defaultSelectedKey="geral"
        label="Configurações"
        onActiveIdChange={onActiveIdChange}
        onSelectionChange={onSelectionChange}
        showSeparators
        tabs={[
          { content: "Conteúdo geral", id: "geral", label: "Geral" },
          { content: "Conteúdo de agenda", id: "agenda", label: "Agenda" },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Agenda" }));

    expect(onSelectionChange).toHaveBeenCalledWith("agenda");
    expect(onActiveIdChange).toHaveBeenCalledWith("agenda");
    expect(document.querySelector('[data-slot="tabs-separator"]')).toBeTruthy();
  });
});
