import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("compartilha tamanho, nome acessível e estado loading", () => {
    render(
      <IconButton isLoading label="Atualizar dados" size="lg">
        <span aria-hidden="true">↻</span>
      </IconButton>,
    );

    const button = screen.getByRole("button", { name: "Atualizar dados" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveClass("clv-icon-button--size-lg");
    expect(button.querySelector(".clv-icon-button__spinner")).toBeInTheDocument();
  });
});
