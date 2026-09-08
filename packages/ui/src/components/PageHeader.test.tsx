import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
  it("usa o tamanho e a superfície de marca padrão quando nenhuma variação é informada", () => {
    render(<PageHeader title="Processo comercial" />);

    expect(screen.getByRole("banner")).toHaveAttribute("data-size", "default");
    expect(screen.getByRole("banner")).toHaveAttribute("data-variant", "surface");
  });

  it("expõe o tamanho compacto sem alterar a hierarquia do título", () => {
    render(<PageHeader size="compact" title="Conectar WhatsApp" />);

    expect(screen.getByRole("banner")).toHaveAttribute("data-size", "compact");
    expect(screen.getByRole("heading", { level: 1, name: "Conectar WhatsApp" })).toBeVisible();
  });

  it("aceita uma classe de composição sem perder a região de cabeçalho", () => {
    render(<PageHeader className="custom-header" title="Projetos" />);

    expect(screen.getByRole("banner")).toHaveClass("custom-header");
  });

  it("mantém a navegação antes do conteúdo e a ação à direita", () => {
    render(
      <PageHeader
        actions={<button type="button">Nova análise</button>}
        navigation={<a href="#processo">Voltar ao processo</a>}
        title="Análise de conversas"
        variant="plain"
      />,
    );

    const header = screen.getByRole("banner");
    const action = screen.getByRole("button", { name: "Nova análise" });
    const navigation = screen.getByRole("link", { name: "Voltar ao processo" });
    const body = header.querySelector(".clv-page-header__body");
    const actions = header.querySelector(".clv-page-header__actions");

    expect(header).toHaveAttribute("data-variant", "plain");
    expect(header.querySelector(".clv-page-header__navigation")).toContainElement(navigation);
    expect(body).not.toContainElement(navigation);
    expect(actions).toContainElement(action);
  });
});
