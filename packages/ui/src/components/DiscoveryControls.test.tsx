import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FilterBar } from "./FilterBar";
import { SearchField } from "./SearchField";

describe("controles de descoberta", () => {
  it("comunica a busca e permite limpá-la", () => {
    const onChange = vi.fn();
    const onClear = vi.fn();
    render(
      <SearchField
        clearLabel="Remover consulta"
        onChange={onChange}
        onClear={onClear}
        value="Clínica"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Remover consulta" }));
    expect(onChange).toHaveBeenCalledWith("");
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("mantém a remoção de filtros explícita", () => {
    const onClear = vi.fn();
    render(
      <FilterBar onClear={onClear} summary="2 filtros aplicados">
        <input aria-label="Status" />
      </FilterBar>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(onClear).toHaveBeenCalledOnce();
    expect(screen.getByText("2 filtros aplicados")).toBeVisible();
    expect(screen.getByText("2 filtros aplicados")).toHaveAttribute("aria-live", "polite");
  });

  it("não oferece limpeza acionável quando a busca está desabilitada", () => {
    render(<SearchField onChange={() => {}} value="Clínica" disabled />);

    expect(screen.getByRole("searchbox")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Limpar busca" })).toBeDisabled();
  });
});
