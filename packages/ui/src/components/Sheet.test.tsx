import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Sheet } from "./Sheet";

describe("Sheet", () => {
  it("abre com papel e nome acessíveis", () => {
    render(
      <Sheet title="Detalhes da clínica" trigger="Abrir detalhes">
        Conteúdo lateral
      </Sheet>,
    );
    const trigger = screen.getByRole("button", { name: "Abrir detalhes" });
    expect(trigger).toHaveClass("clv-overlay-trigger", "clv-button", "clv-button--secondary");
    expect(trigger.querySelector("button")).toBeNull();
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "Detalhes da clínica" })).toBeVisible();
  });

  it("informa o fechamento no contrato controlado", () => {
    const onOpenChange = vi.fn();
    render(<Sheet isOpen onOpenChange={onOpenChange} title="Detalhes" trigger="Abrir" />);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("suporta o lado inferior sem trocar a semântica modal", () => {
    render(
      <Sheet side="bottom" title="Ações do projeto" trigger="Abrir ações">
        Conteúdo inferior
      </Sheet>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Abrir ações" }));

    expect(screen.getByRole("dialog", { name: "Ações do projeto" })).toHaveClass(
      "clv-sheet--bottom",
    );
  });

  it("fecha com Escape e devolve o foco ao disparador", () => {
    render(
      <Sheet title="Detalhes" trigger="Abrir">
        Conteúdo
      </Sheet>,
    );
    const trigger = screen.getByRole("button", { name: "Abrir" });
    trigger.focus();
    fireEvent.click(trigger);

    fireEvent.keyDown(screen.getByRole("dialog", { name: "Detalhes" }), {
      code: "Escape",
      key: "Escape",
    });

    expect(screen.queryByRole("dialog", { name: "Detalhes" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("associa descrição e permite bloquear o fechamento por teclado", () => {
    const onOpenChange = vi.fn();
    render(
      <Sheet
        description="O painel mantém o contexto da tela."
        isKeyboardDismissDisabled
        isOpen
        onOpenChange={onOpenChange}
        title="Contexto"
        trigger="Abrir contexto"
      />,
    );

    const sheet = screen.getByRole("dialog", { name: "Contexto" });
    expect(sheet).toHaveAccessibleDescription("O painel mantém o contexto da tela.");
    fireEvent.keyDown(sheet, { code: "Escape", key: "Escape" });
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
