import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb", () => {
  it("expõe a hierarquia de navegação e marca a página atual", () => {
    render(
      <Breadcrumb
        items={[
          { href: "/projetos", id: "projetos", label: "Projetos" },
          { href: "/projetos/aurora", id: "aurora", label: "Clínica Aurora" },
          { id: "configuracao", label: "Configuração" },
        ]}
      />,
    );

    expect(screen.getByRole("navigation", { name: "Navegação estrutural" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Projetos" })).toHaveAttribute("href", "/projetos");
    expect(screen.getByText("Configuração")).toHaveAttribute("aria-current", "page");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });
});
