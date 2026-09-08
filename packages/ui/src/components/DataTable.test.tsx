import { ArchiveIcon } from "@clavia-ds/icons";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DataTable } from "./DataTable";

interface ClinicRow {
  id: string;
  name: string;
}

const columns = [
  {
    allowsSorting: true,
    id: "name",
    isRowHeader: true,
    label: "Nome",
    render: (row: ClinicRow) => row.name,
  },
] as const;
const rows: ClinicRow[] = [
  { id: "aurora", name: "Clínica Aurora" },
  { id: "vida", name: "Clínica Vida" },
];

describe("DataTable", () => {
  it("encaminha ordenação, seleção e ações de linha", () => {
    const onSelectionChange = vi.fn();
    const onSortChange = vi.fn();
    render(
      <DataTable
        actions={(row) => <button type="button">Abrir {row.name}</button>}
        columns={columns}
        getRowId={(row) => row.id}
        label="Clínicas"
        onSelectionChange={onSelectionChange}
        onSortChange={onSortChange}
        rows={rows}
        selectionMode="multiple"
      />,
    );
    fireEvent.click(screen.getByRole("columnheader", { name: "Nome" }));
    fireEvent.click(screen.getByRole("row", { name: /Clínica Aurora/ }));
    expect(onSortChange).toHaveBeenCalledWith({ column: "name", direction: "ascending" });
    expect(onSelectionChange).toHaveBeenCalled();
    expect(
      screen.getByRole("checkbox", { name: "Selecionar todas as linhas" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /Selecionar linha aurora/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Abrir Clínica Aurora" })).toBeVisible();
  });

  it("navega entre páginas e bloqueia os limites", () => {
    const onPageChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        getRowId={(row) => row.id}
        label="Clínicas"
        pagination={{ currentPage: 1, onPageChange, pageCount: 2 }}
        rows={rows}
      />,
    );
    expect(screen.getByRole("button", { name: "Página anterior" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Próxima página" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("expõe o estado da última página e não avança além do limite", () => {
    const onPageChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        getRowId={(row) => row.id}
        label="Clínicas"
        pagination={{ currentPage: 2, onPageChange, pageCount: 2 }}
        rows={rows}
      />,
    );

    expect(screen.getByText("Página 2 de 2")).toBeVisible();
    expect(screen.getByRole("button", { name: "Página anterior" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Próxima página" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Próxima página" }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("comunica estados vazio e de carregamento", () => {
    const { rerender } = render(
      <DataTable columns={columns} getRowId={(row) => row.id} label="Clínicas" rows={[]} />,
    );
    expect(screen.getByText("Nenhum resultado encontrado")).toBeVisible();
    rerender(
      <DataTable columns={columns} getRowId={(row) => row.id} label="Clínicas" loading rows={[]} />,
    );
    expect(screen.getByText("Atualizando dados")).toBeVisible();
  });

  it("mantém seleção controlada e diferencia seleção simples", () => {
    const onSelectionChange = vi.fn();
    const selectedKeys = new Set<string>(["aurora"]);

    render(
      <DataTable
        columns={columns}
        getRowId={(row) => row.id}
        label="Clínicas"
        onSelectionChange={onSelectionChange}
        rows={rows}
        selectedKeys={selectedKeys}
        selectionMode="single"
      />,
    );

    expect(screen.getByRole("row", { name: /Clínica Aurora/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    fireEvent.click(screen.getByRole("row", { name: /Clínica Vida/ }));

    const selection = onSelectionChange.mock.calls[0]?.[0];
    expect(selection).not.toBe("all");
    expect([...((selection ?? new Set()) as Set<string | number>)]).toEqual(["vida"]);
  });

  it("compacta ações secundárias em um menu de overflow", () => {
    render(
      <DataTable
        actionMenu={(row) => [
          { icon: <ArchiveIcon />, id: "open", label: `Abrir ${row.name}` },
          { icon: <ArchiveIcon />, id: "archive", label: "Arquivar" },
        ]}
        actionMenuLabel={(row) => `Mais ações para ${row.name}`}
        actionsVariant="overflow"
        columns={columns}
        getRowId={(row) => row.id}
        label="Clínicas"
        rows={rows}
      />,
    );

    expect(screen.getByRole("button", { name: "Mais ações para Clínica Aurora" })).toHaveClass(
      "clv-dropdown-menu__trigger--overflow",
    );
    fireEvent.click(screen.getByRole("button", { name: "Mais ações para Clínica Aurora" }));
    const archiveItem = screen.getByRole("menuitem", { name: "Arquivar" });
    expect(archiveItem).toBeInTheDocument();
    expect(archiveItem.querySelector(".clv-dropdown-menu__item-icon svg")).toBeInTheDocument();
  });

  it("mantém a ação principal e expõe ações secundárias no mesmo registro", () => {
    render(
      <DataTable
        actionMenu={(row) => [{ id: "archive", label: `Arquivar ${row.name}` }]}
        actionMenuLabel={(row) => `Mais ações para ${row.name}`}
        actions={(row) => <button type="button">Abrir {row.name}</button>}
        columns={columns}
        getRowId={(row) => row.id}
        label="Clínicas"
        rows={rows}
      />,
    );

    const firstRow = screen.getByRole("row", { name: /Clínica Aurora/ });

    expect(within(firstRow).getByRole("button", { name: "Abrir Clínica Aurora" })).toBeVisible();
    fireEvent.click(
      within(firstRow).getByRole("button", { name: "Mais ações para Clínica Aurora" }),
    );
    expect(screen.getByRole("menuitem", { name: "Arquivar Clínica Aurora" })).toBeVisible();
  });

  it("expõe erro e indisponibilidade com recuperação explícita", () => {
    const onRetry = vi.fn();
    const { rerender } = render(
      <DataTable
        columns={columns}
        errorDescription="A consulta falhou."
        errorTitle="Falha na consulta"
        getRowId={(row) => row.id}
        label="Clínicas"
        onRetry={onRetry}
        rows={[]}
        state="error"
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Falha na consulta");
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(
      <DataTable
        columns={columns}
        getRowId={(row) => row.id}
        label="Clínicas"
        rows={[]}
        state="unavailable"
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Resultados indisponíveis");
  });

  it("preserva linhas enquanto uma atualização está carregando", () => {
    render(
      <DataTable
        columns={columns}
        getRowId={(row) => row.id}
        label="Clínicas"
        rows={rows}
        state="loading"
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Atualizando dados");
    expect(screen.getByRole("rowheader", { name: "Clínica Aurora" })).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Área de rolagem horizontal da tabela" }),
    ).toHaveAttribute("aria-busy", "true");
  });
});
