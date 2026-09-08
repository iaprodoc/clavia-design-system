import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Popover } from "./Popover";

describe("Popover", () => {
  it("abre conteúdo nomeado a partir do disparador", () => {
    render(
      <Popover title="Filtros" trigger="Abrir filtros">
        Filtros rápidos
      </Popover>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Abrir filtros" }));
    expect(screen.getByRole("dialog", { name: "Filtros" })).toHaveTextContent(
      "FiltrosFiltros rápidos",
    );
  });

  it("fecha com Escape e devolve o foco ao disparador", () => {
    render(
      <Popover title="Filtros" trigger="Abrir filtros">
        Filtros rápidos
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Abrir filtros" });
    trigger.focus();
    fireEvent.click(trigger);

    fireEvent.keyDown(screen.getByRole("dialog", { name: "Filtros" }), {
      code: "Escape",
      key: "Escape",
    });

    expect(screen.queryByRole("dialog", { name: "Filtros" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
