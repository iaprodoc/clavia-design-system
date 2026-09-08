import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IconButton } from "./IconButton";
import { LinkButton } from "./LinkButton";

describe("controles de ação", () => {
  it("preserva o destino e a semântica de link", () => {
    render(<LinkButton href="#orientacoes">Ver orientações</LinkButton>);

    expect(screen.getByRole("link", { name: "Ver orientações" })).toHaveAttribute(
      "href",
      "#orientacoes",
    );
  });

  it("nomeia o botão de ícone e mantém o tipo seguro para formulários", () => {
    render(
      <IconButton label="Editar item">
        <svg aria-hidden="true" />
      </IconButton>,
    );

    expect(screen.getByRole("button", { name: "Editar item" })).toHaveAttribute("type", "button");
  });
});
