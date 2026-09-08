import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FilterDialog, FilterDialogGroup, FilterDialogRow } from "./FilterDialog";
import { Select } from "./Select";

describe("FilterDialog", () => {
  it("expõe filtros avançados sem substituir o gatilho rápido", () => {
    const onApply = vi.fn();
    const onClear = vi.fn();

    render(
      <FilterDialog
        activeFilterCount={2}
        onApply={onApply}
        onClear={onClear}
        title="Filtrar projetos"
      >
        <FilterDialogGroup label="Situação">
          <FilterDialogRow label="Status">
            <Select
              label="Status"
              options={[{ label: "Todos os status", value: "all" }]}
              value="all"
            />
          </FilterDialogRow>
        </FilterDialogGroup>
      </FilterDialog>,
    );

    expect(screen.getByRole("button", { name: /Filtros.*2 filtros aplicados/i })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /Filtros.*2 filtros aplicados/i }));

    expect(screen.getByRole("dialog", { name: "Filtrar projetos" })).toBeVisible();
    expect(screen.getByText("Situação")).toBeVisible();
    expect(screen.getByRole("button", { name: "Limpar filtros" })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Limpar filtros" }));
    fireEvent.click(screen.getByRole("button", { name: "Aplicar filtros" }));
    expect(onClear).toHaveBeenCalledOnce();
    expect(onApply).toHaveBeenCalledOnce();
  });
});
