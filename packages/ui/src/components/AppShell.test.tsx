import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("separa cabeçalho, navegação persistente e conteúdo principal", () => {
    render(
      <AppShell header={<span>Clavia Hub</span>} navigation={<a href="/projetos">Projetos</a>}>
        <h1>Visão geral</h1>
      </AppShell>,
    );

    expect(screen.getByRole("banner")).toHaveTextContent("Clavia Hub");
    expect(screen.getByRole("complementary", { name: "Navegação principal" })).toContainElement(
      screen.getByRole("link", { name: "Projetos" }),
    );
    expect(screen.getByRole("main")).toHaveTextContent("Visão geral");
  });

  it("não cria região lateral sem conteúdo de navegação", () => {
    const { container } = render(<AppShell>Conteúdo</AppShell>);

    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("Conteúdo");
    expect(container.querySelector(".clv-app-shell__body")).toHaveAttribute(
      "data-has-navigation",
      "false",
    );
  });

  it("organiza cabeçalho interno, navegação contextual e rodapés sem duplicar o main", () => {
    render(
      <AppShell
        contentFooter={<span>Atualizado agora</span>}
        contentHeader={<span>Busca e ações</span>}
        contentWidth="wide"
        footer={<span>Clavia 2026</span>}
        navigation={<a href="/inicio">Início</a>}
        secondaryNavigation={<a href="/fila">Fila atual</a>}
        secondaryNavigationLabel="Contexto da operação"
      >
        <h1>Atendimento</h1>
      </AppShell>,
    );

    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    expect(
      screen.getByText("Busca e ações").closest(".clv-app-shell__content-header"),
    ).not.toBeNull();
    expect(screen.getAllByRole("complementary")).toHaveLength(2);
    expect(screen.getByRole("complementary", { name: "Contexto da operação" })).toHaveTextContent(
      "Fila atual",
    );
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Clavia 2026");
    expect(
      screen.getByText("Atualizado agora").closest(".clv-app-shell__content-footer"),
    ).not.toBeNull();
    expect(screen.getByRole("main")).toHaveTextContent("Atendimento");
    expect(screen.getByRole("main").closest(".clv-app-shell")).toHaveAttribute(
      "data-content-width",
      "wide",
    );
  });
});
