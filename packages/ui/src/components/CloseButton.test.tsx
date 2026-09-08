import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CloseButton } from "./CloseButton";

describe("CloseButton", () => {
  it("oferece ação icon-only com nome acessível e tamanho padrão", () => {
    render(<CloseButton />);

    const button = screen.getByRole("button", { name: "Fechar" });
    expect(button).toHaveClass("clv-icon-button--size-sm");
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("respeita o estado desabilitado do contrato de fechamento", () => {
    render(<CloseButton isDisabled label="Fechar painel" />);

    expect(screen.getByRole("button", { name: "Fechar painel" })).toBeDisabled();
  });

  it("oferece a escala extra compacta para alertas densos", () => {
    render(<CloseButton label="Fechar alerta" size="xs" />);

    expect(screen.getByRole("button", { name: "Fechar alerta" })).toHaveClass(
      "clv-icon-button--size-xs",
    );
  });
});
