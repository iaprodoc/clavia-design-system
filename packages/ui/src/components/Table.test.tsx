import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Table } from "./Table";

function renderBasicTable() {
  return render(
    <Table>
      <Table.ScrollContainer data-testid="scroll-container">
        <Table.Content label="Clínicas" minWidth="42rem">
          <Table.Header>
            <Table.Column id="clinic" isRowHeader>
              Clínica
            </Table.Column>
            <Table.Column id="status">Status</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row id="aurora">
              <Table.Cell>Clínica Aurora</Table.Cell>
              <Table.Cell>Ativa</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>,
  );
}

describe("Table", () => {
  it("expõe tabela, cabeçalhos e célula de identificação com semântica própria", () => {
    renderBasicTable();

    expect(screen.getByRole("grid", { name: "Clínicas" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Clínica" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Clínica Aurora" })).toBeInTheDocument();
    expect(screen.getByRole("gridcell", { name: "Ativa" })).toBeInTheDocument();
    expect(screen.getByTestId("scroll-container")).toHaveClass("clv-table__scroll-container");
    expect(
      screen.getByRole("region", { name: "Área de rolagem horizontal da tabela" }),
    ).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("grid", { name: "Clínicas" })).toHaveStyle({ minWidth: "42rem" });
  });

  it("permite nomear a região de rolagem para orientar o uso por teclado", () => {
    render(
      <Table>
        <Table.ScrollContainer scrollLabel="Role horizontalmente para ver todas as colunas">
          <Table.Content label="Clínicas">
            <Table.Header>
              <Table.Column id="clinic" isRowHeader>
                Clínica
              </Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="aurora">
                <Table.Cell>Clínica Aurora</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>,
    );

    const scrollRegion = screen.getByRole("region", {
      name: "Role horizontalmente para ver todas as colunas",
    });

    scrollRegion.focus();
    expect(scrollRegion).toHaveFocus();
  });

  it("encaminha a ordenação solicitada pelo cabeçalho", () => {
    const onSortChange = vi.fn();

    render(
      <Table>
        <Table.ScrollContainer>
          <Table.Content label="Clínicas ordenáveis" onSortChange={onSortChange}>
            <Table.Header>
              <Table.Column allowsSorting id="clinic" isRowHeader>
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    Clínica
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column id="status">Status</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="aurora">
                <Table.Cell>Clínica Aurora</Table.Cell>
                <Table.Cell>Ativa</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>,
    );

    fireEvent.click(screen.getByRole("columnheader", { name: "Clínica" }));

    expect(onSortChange).toHaveBeenCalledWith({ column: "clinic", direction: "ascending" });
  });

  it("comunica o estado vazio dentro da própria tabela", () => {
    render(
      <Table>
        <Table.ScrollContainer>
          <Table.Content label="Resultados da busca">
            <Table.Header>
              <Table.Column id="clinic" isRowHeader>
                Clínica
              </Table.Column>
              <Table.Column id="status">Status</Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <Table.EmptyState
                  description="Revise a busca ou remova os filtros aplicados."
                  title="Nenhuma clínica encontrada"
                />
              )}
            >
              {[]}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>,
    );

    expect(screen.getByText("Nenhuma clínica encontrada")).toBeInTheDocument();
    expect(screen.getByText("Revise a busca ou remova os filtros aplicados.")).toBeInTheDocument();
  });

  it("expõe o indicador de ordenação com direção e classe pública da Clavia", () => {
    render(
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            label="Clínicas ordenáveis"
            sortDescriptor={{ column: "clinic", direction: "descending" }}
          >
            <Table.Header>
              <Table.Column allowsSorting id="clinic">
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    Clínica
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="aurora">
                <Table.Cell>Clínica Aurora</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>,
    );

    const indicator = document.querySelector(".clv-table__sortable-column-indicator");

    expect(indicator).toHaveAttribute("aria-hidden", "true");
    expect(indicator).toHaveAttribute("data-direction", "descending");
    expect(indicator).toHaveClass("clv-table__sortable-column-indicator");
  });

  it("permite renderizar colunas e linhas por coleção dinâmica", () => {
    const columns = [
      { id: "clinic", label: "Clínica" },
      { id: "status", label: "Status" },
    ];
    const rows = [
      { clinic: "Clínica Aurora", status: "Ativa" },
      { clinic: "Clínica Vida", status: "Pausada" },
    ];

    render(
      <Table>
        <Table.ScrollContainer>
          <Table.Content label="Clínicas dinâmicas">
            <Table.Header columns={columns}>
              {(column) => (
                <Table.Column id={column.id} isRowHeader={column.id === "clinic"}>
                  {column.label}
                </Table.Column>
              )}
            </Table.Header>
            <Table.Body items={rows}>
              {(row) => (
                <Table.Row id={row.clinic}>
                  <Table.Collection items={columns}>
                    {(column) => <Table.Cell>{row[column.id as keyof typeof row]}</Table.Cell>}
                  </Table.Collection>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>,
    );

    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(screen.getByRole("rowheader", { name: "Clínica Aurora" })).toBeInTheDocument();
    expect(screen.getByRole("gridcell", { name: "Pausada" })).toBeInTheDocument();
  });

  it("oferece checks acessíveis para seleção múltipla", () => {
    const onSelectionChange = vi.fn();

    render(
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            label="Clínicas selecionáveis"
            selectionMode="multiple"
            onSelectionChange={onSelectionChange}
          >
            <Table.Header>
              <Table.Column id="selection">
                <Table.SelectionCheckbox aria-label="Selecionar todas as clínicas" />
              </Table.Column>
              <Table.Column id="clinic" isRowHeader>
                Clínica
              </Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="aurora">
                <Table.Cell>
                  <Table.SelectionCheckbox aria-label="Selecionar Clínica Aurora" />
                </Table.Cell>
                <Table.Cell>Clínica Aurora</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>,
    );

    expect(
      screen.getByRole("checkbox", { name: "Selecionar todas as clínicas" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: /Selecionar Clínica Aurora/ }));
    const selection = onSelectionChange.mock.calls[0]?.[0];
    expect(selection).not.toBe("all");
    expect([...((selection ?? new Set()) as Set<string | number>)]).toEqual(["aurora"]);
  });

  it("oferece um radio explícito para seleção simples", () => {
    render(
      <Table>
        <Table.ScrollContainer>
          <Table.Content label="Clínicas selecionáveis" selectionMode="single">
            <Table.Header>
              <Table.Column aria-label="Seleção" id="selection" />
              <Table.Column id="clinic" isRowHeader>
                Clínica
              </Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="aurora">
                <Table.Cell>
                  <Table.SelectionRadio
                    aria-label="Selecionar Clínica Aurora"
                    name="clinicas"
                    value="aurora"
                  />
                </Table.Cell>
                <Table.Cell>Clínica Aurora</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>,
    );

    expect(screen.getByRole("radio", { name: "Selecionar Clínica Aurora" })).toBeInTheDocument();
  });

  it("expande e recolhe descendentes da coleção", () => {
    const rows = [
      {
        children: [{ children: [], id: "unit", name: "Unidade Centro" }],
        id: "clinic",
        name: "Clínica Aurora",
      },
    ];

    render(
      <Table>
        <Table.ScrollContainer>
          <Table.Content label="Clínicas hierárquicas" treeColumn="name">
            <Table.Header>
              <Table.Column id="name" isRowHeader>
                Nome
              </Table.Column>
            </Table.Header>
            <Table.Body items={rows}>
              {(row) => (
                <Table.Row id={row.id} textValue={row.name}>
                  <Table.Cell textValue={row.name}>
                    {({ hasChildItems, isTreeColumn }) => (
                      <>
                        {hasChildItems && isTreeColumn ? (
                          <Table.ExpandButton aria-label="Mostrar ou ocultar unidades" />
                        ) : null}
                        {row.name}
                      </>
                    )}
                  </Table.Cell>
                  <Table.Collection items={row.children}>
                    {(child) => (
                      <Table.Row id={child.id} textValue={child.name}>
                        <Table.Cell>{child.name}</Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Collection>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>,
    );

    expect(screen.queryByRole("row", { name: "Unidade Centro" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Mostrar ou ocultar unidades/ }));
    expect(screen.getByRole("row", { name: "Unidade Centro" })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /Clínica Aurora/ })).toHaveAttribute("data-level", "1");
    expect(screen.getByRole("row", { name: "Unidade Centro" })).toHaveAttribute("data-level", "2");
    expect(screen.getByRole("rowheader", { name: "Unidade Centro" })).toHaveAttribute(
      "data-level",
      "2",
    );
    expect(screen.getByRole("row", { name: /Clínica Aurora/ })).toHaveAttribute(
      "data-expanded",
      "true",
    );
  });
});
