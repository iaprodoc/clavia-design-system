import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Divider } from "./Divider";
import { Section } from "./Section";

describe("conteúdo e layout", () => {
  it("associa uma seção ao seu título e preserva as ações no cabeçalho", () => {
    render(
      <Section actions={<button type="button">Editar</button>} title="Responsáveis">
        Conteúdo da seção
      </Section>,
    );

    expect(screen.getByRole("region", { name: "Responsáveis" })).toHaveTextContent("Editar");
    expect(screen.getByRole("heading", { name: "Responsáveis", level: 2 })).toBeVisible();
  });

  it("mantém o conteúdo e as ações acessíveis quando a seção fica estreita", () => {
    render(
      <Section actions={<button type="button">Editar</button>} title="Responsáveis">
        <p>Conteúdo longo para confirmar que a região continua estruturada.</p>
      </Section>,
    );

    expect(screen.getByRole("region", { name: "Responsáveis" })).toContainElement(
      screen.getByRole("button", { name: "Editar" }),
    );
  });

  it("mantém a separação horizontal como elemento semântico", () => {
    render(<Divider />);

    expect(screen.getByRole("separator")).toHaveClass("clv-divider--horizontal");
  });
});
