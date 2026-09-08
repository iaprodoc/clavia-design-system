import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingState } from "./LoadingState";

describe("LoadingState", () => {
  it("comunica carregamento com nome acessível", () => {
    render(<LoadingState description="Buscando projetos" label="Carregando projetos" />);
    expect(screen.getByRole("status", { name: "Carregando projetos" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.getByText("Carregando projetos")).toBeVisible();
  });
});
