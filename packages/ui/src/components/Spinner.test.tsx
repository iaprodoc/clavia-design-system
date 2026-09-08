import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("expõe a espera para tecnologias assistivas", () => {
    render(<Spinner label="Salvando alterações" />);

    const spinner = screen.getByRole("status", { name: "Salvando alterações" });
    expect(spinner).toHaveAttribute("viewBox", "0 0 24 24");
    expect(spinner.querySelector(".clv-spinner__track")).not.toBeNull();
    expect(spinner.querySelector(".clv-spinner__indicator")).toHaveAttribute(
      "stroke-linecap",
      "round",
    );
  });

  it("aplica tamanho e tom semântico", () => {
    render(<Spinner size="xl" tone="success" />);

    expect(screen.getByRole("status", { name: "Carregando" })).toHaveClass(
      "clv-spinner--xl",
      "clv-spinner--success",
    );
  });
});
