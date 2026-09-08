import { GridIcon } from "@clavia-ds/icons";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NavItem } from "./NavItem";

describe("NavItem", () => {
  it("preserva o destino, o nome acessível e a página atual", () => {
    render(
      <NavItem current href="/projetos" icon={<GridIcon />}>
        Projetos
      </NavItem>,
    );

    const item = screen.getByRole("link", { name: "Projetos" });

    expect(item).toHaveAttribute("href", "/projetos");
    expect(item).toHaveAttribute("aria-current", "page");
    expect(item.querySelector(".clv-nav-item__icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("não anuncia estado atual quando representa outro destino", () => {
    render(<NavItem href="/configuracoes">Configurações</NavItem>);

    expect(screen.getByRole("link", { name: "Configurações" })).not.toHaveAttribute("aria-current");
  });
});
