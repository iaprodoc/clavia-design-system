import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./Button";
import { ButtonGroup } from "./ButtonGroup";

describe("ButtonGroup", () => {
  it("agrupa ações relacionadas com um nome acessível", () => {
    render(
      <ButtonGroup label="Ações do formulário">
        <button type="button">Voltar</button>
        <button type="button">Continuar</button>
      </ButtonGroup>,
    );

    expect(screen.getByRole("group", { name: "Ações do formulário" })).toHaveClass(
      "clv-button-group--horizontal",
    );
  });

  it("oferece empilhamento explícito para ações estreitas", () => {
    render(
      <ButtonGroup label="Ações do formulário" orientation="vertical">
        <button type="button">Continuar</button>
      </ButtonGroup>,
    );

    expect(screen.getByRole("group")).toHaveClass("clv-button-group--vertical");
    expect(screen.getByRole("group")).not.toHaveClass("clv-button-group--joined");
  });

  it("propaga variante, tamanho, largura e disponibilidade para Buttons filhos", () => {
    render(
      <ButtonGroup fullWidth isDisabled label="Ações agrupadas" size="sm" variant="primary">
        <Button>Primeira</Button>
        <Button isDisabled={false}>Disponível</Button>
      </ButtonGroup>,
    );

    const group = screen.getByRole("group");
    const buttons = screen.getAllByRole("button");

    expect(group).toHaveClass("clv-button-group--full-width", "clv-button-group--joined");
    expect(buttons[0]).toHaveClass("clv-button--size-sm", "clv-button--full-width");
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).not.toBeDisabled();
  });
});
