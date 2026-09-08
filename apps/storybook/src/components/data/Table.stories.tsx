import { StatusBadge, type StatusKind, Table, type TableSortDescriptor } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import { expect, userEvent, within } from "storybook/test";

interface ClinicRow {
  city: string;
  clinic: string;
  id: string;
  status: "Ativa" | "Em implantação" | "Pausada";
  updatedAt: string;
}

const clinics: ClinicRow[] = [
  {
    city: "Fortaleza, CE",
    clinic: "Clínica Aurora",
    id: "aurora",
    status: "Ativa",
    updatedAt: "Hoje, 10:42",
  },
  {
    city: "Recife, PE",
    clinic: "Clínica Horizonte",
    id: "horizonte",
    status: "Em implantação",
    updatedAt: "Ontem, 16:18",
  },
  {
    city: "Natal, RN",
    clinic: "Clínica Sereno",
    id: "sereno",
    status: "Pausada",
    updatedAt: "12 ago., 09:05",
  },
  {
    city: "João Pessoa, PB",
    clinic: "Clínica Vida",
    id: "vida",
    status: "Ativa",
    updatedAt: "11 ago., 14:30",
  },
];

const statusKinds: Record<ClinicRow["status"], StatusKind> = {
  Ativa: "success",
  "Em implantação": "info",
  Pausada: "warning",
};

const meta = {
  component: Table,
  decorators: [
    (Story) => (
      <div className="clv-story-table-preview">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Tabela composta da Clavia para dados comparáveis. A API, os tokens e os estilos pertencem ao Design System. O contrato cobre rolagem horizontal, coleção dinâmica, cabeçalho de linha, ordenação, radio para seleção simples, checks para seleção múltipla, estados de dados, rodapé e linhas hierárquicas expansíveis; redimensionamento, virtualização e carregamento incremental permanecem adiados até haver necessidade comprovada no produto.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Componentes/Dados/Table",
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

function ClinicRows({ rows }: { rows: ClinicRow[] }) {
  return rows.map((clinic) => (
    <Table.Row id={clinic.id} key={clinic.id}>
      <Table.Cell>{clinic.clinic}</Table.Cell>
      <Table.Cell>{clinic.city}</Table.Cell>
      <Table.Cell>
        <StatusBadge status={statusKinds[clinic.status]}>{clinic.status}</StatusBadge>
      </Table.Cell>
      <Table.Cell>{clinic.updatedAt}</Table.Cell>
    </Table.Row>
  ));
}

function OperationalClinicTable({
  rows,
  scrollLabel,
}: {
  rows: ClinicRow[];
  scrollLabel?: string;
}) {
  return (
    <Table>
      <Table.ScrollContainer {...(scrollLabel ? { scrollLabel } : {})}>
        <Table.Content label="Clínicas" minWidth="46rem">
          <Table.Header>
            <Table.Column id="clinic" isRowHeader>
              Clínica
            </Table.Column>
            <Table.Column id="city">Cidade</Table.Column>
            <Table.Column id="status">Status</Table.Column>
            <Table.Column id="updatedAt">Última atualização</Table.Column>
          </Table.Header>
          <Table.Body>
            <ClinicRows rows={rows} />
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      <Table.Footer>
        <span>
          {rows.length === 1 ? "1 clínica fictícia" : `${rows.length} clínicas fictícias`}
        </span>
        <span>Dados para demonstração</span>
      </Table.Footer>
    </Table>
  );
}

export const DadosOperacionais: Story = {
  name: "Dados operacionais",
  parameters: {
    docs: {
      description: {
        story:
          "Use quando as pessoas precisarem comparar registros pela mesma estrutura de colunas. A superfície é plana, o cabeçalho tem menor ênfase e as extremidades recebem mais respiro. Em larguras menores, preserve as colunas essenciais e permita rolagem horizontal. Quando a leitura tabular deixar de funcionar no mobile, componha uma lista própria no produto em vez de transformar automaticamente cada linha em cartão.",
      },
    },
  },
  render: () => <OperationalClinicTable rows={clinics} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvasElement.querySelector<HTMLElement>(".clv-table");
    const scrollContainer = canvasElement.querySelector<HTMLElement>(
      ".clv-table__scroll-container",
    );
    const clinicHeader = canvas.getByRole("columnheader", { name: "Clínica" });
    const firstClinic = canvas.getByRole("rowheader", { name: "Clínica Aurora" });
    const lastUpdate = canvas.getByRole("gridcell", { name: "11 ago., 14:30" });
    const footerCaption = canvas.getByText("4 clínicas fictícias");

    await expect(table).toBeInTheDocument();
    await expect(scrollContainer).toBeInTheDocument();
    await expect(getComputedStyle(table as HTMLElement).borderTopWidth).toBe("0px");
    await expect(getComputedStyle(scrollContainer as HTMLElement).paddingInlineStart).toBe("8px");
    await expect(getComputedStyle(clinicHeader).fontWeight).toBe("400");
    await expect(getComputedStyle(clinicHeader).borderBottomWidth).toBe("0px");
    await expect(getComputedStyle(clinicHeader).paddingInlineStart).toBe("20px");
    await expect(getComputedStyle(firstClinic).paddingBlockStart).toBe("16px");
    await expect(getComputedStyle(firstClinic).paddingInlineStart).toBe("20px");
    await expect(getComputedStyle(firstClinic).borderTopLeftRadius).toBe("12px");
    await expect(getComputedStyle(firstClinic).borderBottomColor).toBe(
      getComputedStyle(table as HTMLElement).backgroundColor,
    );
    await expect(getComputedStyle(lastUpdate).borderBottomRightRadius).toBe("12px");
    await expect(getComputedStyle(footerCaption).fontSize).toBe("12px");
  },
};

export const UmaLinha: Story = {
  name: "Uma linha",
  parameters: {
    docs: {
      description: {
        story:
          "Confirma que a superfície, o cabeçalho e o rodapé continuam equilibrados quando existe apenas um registro.",
      },
    },
  },
  render: () => <OperationalClinicTable rows={clinics.slice(0, 1)} />,
};

export const ConteudoExtenso: Story = {
  name: "Conteúdo extenso",
  parameters: {
    docs: {
      description: {
        story:
          "Exercita nomes e localidades longos sem reduzir a tipografia. Em áreas estreitas, a tabela preserva sua largura mínima e continua rolável.",
      },
    },
  },
  render: () => (
    <OperationalClinicTable
      rows={[
        {
          city: "São José do Rio Preto, SP",
          clinic: "Clínica Integrada de Saúde Horizonte",
          id: "horizonte-integrada",
          status: "Em implantação",
          updatedAt: "Hoje, 10:42",
        },
        ...clinics.slice(0, 1),
      ]}
    />
  ),
};

export const ViewportCompacto: Story = {
  name: "Viewport compacto",
  parameters: {
    docs: {
      description: {
        story:
          "Em viewport compacto, a região rolável recebe foco, nome acessível e contorno visível. Use Tab para alcançar a tabela e as setas do teclado para rolar horizontalmente; não esconda colunas nem converta automaticamente linhas em cards.",
      },
    },
  },
  render: () => (
    <div style={{ maxInlineSize: "20rem" }}>
      <OperationalClinicTable
        rows={clinics}
        scrollLabel="Role horizontalmente para consultar todas as colunas de clínicas"
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const scrollRegion = canvas.getByRole("region", {
      name: "Role horizontalmente para consultar todas as colunas de clínicas",
    });

    await expect(scrollRegion).toHaveAttribute("tabindex", "0");
    await userEvent.tab();
    await expect(scrollRegion).toHaveFocus();
  },
};

function SortableClinicTable() {
  const [sortDescriptor, setSortDescriptor] = useState<TableSortDescriptor>({
    column: "clinic",
    direction: "ascending",
  });
  const sortedClinics = useMemo(() => {
    const column = sortDescriptor.column as keyof ClinicRow;

    return [...clinics].sort((first, second) => {
      const comparison = String(first[column]).localeCompare(String(second[column]), "pt-BR");

      return sortDescriptor.direction === "descending" ? comparison * -1 : comparison;
    });
  }, [sortDescriptor]);

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          label="Clínicas ordenáveis"
          minWidth="46rem"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <Table.Header>
            <Table.Column allowsSorting id="clinic" isRowHeader>
              {({ sortDirection }) => (
                <Table.SortableColumnHeader sortDirection={sortDirection}>
                  Clínica
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column allowsSorting id="city">
              {({ sortDirection }) => (
                <Table.SortableColumnHeader sortDirection={sortDirection}>
                  Cidade
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column allowsSorting id="status">
              {({ sortDirection }) => (
                <Table.SortableColumnHeader sortDirection={sortDirection}>
                  Status
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column allowsSorting id="updatedAt">
              {({ sortDirection }) => (
                <Table.SortableColumnHeader sortDirection={sortDirection}>
                  Última atualização
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
          </Table.Header>
          <Table.Body>
            <ClinicRows rows={sortedClinics} />
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

export const Ordenacao: Story = {
  name: "Ordenação",
  parameters: {
    docs: {
      description: {
        story:
          "A ordenação é controlada pelo produto: a Table comunica coluna e direção, e quem consome decide como ordenar dados locais ou solicitar uma nova consulta. O cabeçalho permanece operável por teclado.",
      },
    },
  },
  render: () => <SortableClinicTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole("grid", { name: "Clínicas ordenáveis" });
    const clinicHeader = within(grid).getByRole("columnheader", { name: "Clínica" });
    const scrollContainer = canvasElement.querySelector<HTMLElement>(
      ".clv-table__scroll-container",
    );

    await expect(scrollContainer).toBeInTheDocument();
    await expect(getComputedStyle(scrollContainer as HTMLElement).overflowX).toBe("auto");
    await expect(getComputedStyle(scrollContainer as HTMLElement).scrollbarWidth).toBe("none");
    await expect(clinicHeader).toHaveAttribute("aria-sort", "ascending");
    clinicHeader.focus();
    await userEvent.keyboard("{Enter}");

    await expect(clinicHeader).toHaveAttribute("aria-sort", "descending");
    await expect(within(grid).getAllByRole("rowheader")[0]).toHaveTextContent("Clínica Vida");

    clinicHeader.blur();
    await expect(clinicHeader).not.toHaveFocus();
  },
};

export const SemResultados: Story = {
  name: "Sem resultados",
  parameters: {
    docs: {
      description: {
        story:
          "O vazio pertence à área de dados e explica como continuar. Use este estado depois de uma busca ou filtro sem correspondência; para a ausência inicial de conteúdo com uma ação principal, prefira EmptyState fora da tabela.",
      },
    },
  },
  render: () => (
    <Table variant="plain">
      <Table.ScrollContainer>
        <Table.Content label="Resultados da busca" minWidth="40rem">
          <Table.Header>
            <Table.Column id="clinic" isRowHeader>
              Clínica
            </Table.Column>
            <Table.Column id="city">Cidade</Table.Column>
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
    </Table>
  ),
};

function DynamicCollectionTable() {
  const columns = [
    { id: "clinic", isRowHeader: true, label: "Clínica" },
    { id: "city", label: "Cidade" },
    { id: "updatedAt", label: "Última atualização" },
  ] as const;

  return (
    <Table variant="plain">
      <Table.ScrollContainer>
        <Table.Content label="Coleção dinâmica de clínicas" minWidth="40rem">
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column id={column.id} isRowHeader={column.id === "clinic"}>
                {column.label}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body items={clinics.slice(0, 3)}>
            {(clinic) => (
              <Table.Row id={clinic.id}>
                <Table.Collection items={columns}>
                  {(column) => <Table.Cell>{clinic[column.id as keyof ClinicRow]}</Table.Cell>}
                </Table.Collection>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

export const ColecaoDinamica: Story = {
  name: "Coleção dinâmica",
  parameters: {
    docs: {
      description: {
        story:
          "Use `columns` e `items` quando a estrutura vier de uma coleção. `Table.Collection` mantém células dinâmicas ao lado de partes estáticas da linha sem esconder a semântica de tabela.",
      },
    },
  },
  render: () => <DynamicCollectionTable />,
};

function SelectionTable({ mode }: { mode: "multiple" | "single" }) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set());

  return (
    <div className="clv-story-table-stack">
      <Table>
        <Table.ScrollContainer scrollLabel="Área de rolagem das clínicas carregando">
          <Table.Content
            label={
              mode === "multiple" ? "Seleção múltipla de clínicas" : "Seleção simples de clínicas"
            }
            minWidth="40rem"
            selectedKeys={selectedKeys}
            selectionMode={mode}
            onSelectionChange={(keys) => {
              setSelectedKeys(
                keys === "all" ? new Set(clinics.map((clinic) => clinic.id)) : new Set(keys),
              );
            }}
          >
            <Table.Header>
              {mode === "multiple" ? (
                <Table.Column className="clv-table__selection-column" id="selection">
                  <Table.SelectionCheckbox aria-label="Selecionar todas as clínicas" />
                </Table.Column>
              ) : (
                <Table.Column
                  aria-label="Seleção"
                  className="clv-table__selection-column"
                  id="selection"
                >
                  <span className="clv-sr-only">Seleção</span>
                </Table.Column>
              )}
              <Table.Column id="clinic" isRowHeader>
                Clínica
              </Table.Column>
              <Table.Column id="status">Status</Table.Column>
              <Table.Column id="city">Cidade</Table.Column>
            </Table.Header>
            <Table.Body>
              {clinics.map((clinic) => (
                <Table.Row id={clinic.id} key={clinic.id}>
                  {mode === "multiple" ? (
                    <Table.Cell className="clv-table__selection-cell">
                      <Table.SelectionCheckbox aria-label={`Selecionar ${clinic.clinic}`} />
                    </Table.Cell>
                  ) : (
                    <Table.Cell className="clv-table__selection-cell">
                      <Table.SelectionRadio
                        aria-label={`Selecionar ${clinic.clinic}`}
                        checked={selectedKeys.has(clinic.id)}
                        name="clinicas"
                        value={clinic.id}
                        onClick={(event) => event.stopPropagation()}
                        onChange={() => setSelectedKeys(new Set([clinic.id]))}
                      />
                    </Table.Cell>
                  )}
                  <Table.Cell>{clinic.clinic}</Table.Cell>
                  <Table.Cell>{clinic.status}</Table.Cell>
                  <Table.Cell>{clinic.city}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <p aria-live="polite" className="clv-story-table-selection-summary">
        {selectedKeys.size === 0
          ? "Nenhuma clínica selecionada"
          : `${selectedKeys.size} clínica(s) selecionada(s)`}
      </p>
    </div>
  );
}

export const SelecaoMultipla: Story = {
  name: "Seleção múltipla controlada",
  parameters: {
    docs: {
      description: {
        story:
          "A seleção múltipla é controlada pelo consumidor e pode ser acionada por clique, checkboxes ou teclado. O estado selecionado é comunicado pelo React Aria e também tem tratamento visual e semântico na linha.",
      },
    },
  },
  render: () => <SelectionTable mode="multiple" />,
  play: async ({ canvas }) => {
    const firstRow = canvas.getByRole("row", { name: /Clínica Aurora/ });
    await userEvent.click(firstRow);
    await expect(firstRow).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByText("1 clínica(s) selecionada(s)")).toBeVisible();
  },
};

export const SelecaoSimples: Story = {
  name: "Seleção simples controlada",
  parameters: {
    docs: {
      description: {
        story:
          "Use seleção simples quando uma única linha puder receber a ação. O radio torna a escolha explícita, e a seleção anterior é substituída ao escolher outra linha.",
      },
    },
  },
  render: () => <SelectionTable mode="single" />,
  play: async ({ canvas }) => {
    const radios = canvas.getAllByRole("radio");
    await expect(radios).toHaveLength(clinics.length);
    const secondRow = canvas.getByRole("row", { name: /Clínica Vida/ });
    await userEvent.click(secondRow);
    await expect(secondRow).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("radio", { name: "Selecionar Clínica Vida" })).toBeChecked();
    await expect(canvas.getByText("1 clínica(s) selecionada(s)")).toBeVisible();
  },
};

interface ExpandableClinicRow {
  children: ExpandableClinicRow[];
  city: string;
  id: string;
  name: string;
  type: "Clínica" | "Unidade" | "Setor";
}

const expandableClinics: ExpandableClinicRow[] = [
  {
    children: [
      {
        children: [
          {
            children: [],
            city: "Fortaleza, CE",
            id: "aurora-centro-recepcao",
            name: "Recepção",
            type: "Setor",
          },
          {
            children: [],
            city: "Fortaleza, CE",
            id: "aurora-centro-consultorios",
            name: "Consultórios",
            type: "Setor",
          },
        ],
        city: "Fortaleza, CE",
        id: "aurora-centro",
        name: "Unidade Centro",
        type: "Unidade",
      },
    ],
    city: "Fortaleza, CE",
    id: "aurora",
    name: "Clínica Aurora",
    type: "Clínica",
  },
  {
    children: [],
    city: "Recife, PE",
    id: "horizonte",
    name: "Clínica Horizonte",
    type: "Clínica",
  },
];

function ExpandableClinicTable() {
  const [expandedKeys, setExpandedKeys] = useState<Set<string | number>>(
    new Set(["aurora", "aurora-centro"]),
  );
  const renderRow = (clinic: ExpandableClinicRow) => (
    <Table.Row id={clinic.id} key={clinic.id} textValue={clinic.name}>
      <Table.Cell textValue={clinic.name}>
        {({ hasChildItems, isDisabled, isTreeColumn }) => (
          <span className="clv-table__tree-cell">
            {hasChildItems && isTreeColumn ? (
              <Table.ExpandButton
                aria-label={`Mostrar ou ocultar ${clinic.name}`}
                isDisabled={isDisabled}
              />
            ) : null}
            <span>{clinic.name}</span>
          </span>
        )}
      </Table.Cell>
      <Table.Cell>{clinic.type}</Table.Cell>
      <Table.Cell>{clinic.city}</Table.Cell>
      <Table.Collection items={clinic.children}>{renderRow}</Table.Collection>
    </Table.Row>
  );

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          expandedKeys={expandedKeys}
          label="Clínicas e unidades"
          minWidth="40rem"
          treeColumn="name"
          onExpandedChange={setExpandedKeys}
        >
          <Table.Header>
            <Table.Column id="name" isRowHeader>
              Clínica ou unidade
            </Table.Column>
            <Table.Column id="type">Tipo</Table.Column>
            <Table.Column id="city">Cidade</Table.Column>
          </Table.Header>
          <Table.Body items={expandableClinics}>{renderRow}</Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

export const LinhasExpansiveis: Story = {
  name: "Linhas expansíveis",
  parameters: {
    docs: {
      description: {
        story:
          "Use linhas expansíveis para dados hierárquicos, como clínicas e unidades. A coluna de árvore informa a hierarquia, o controle recebe foco e a coleção mantém apenas os descendentes de linhas abertas no DOM.",
      },
    },
  },
  render: () => <ExpandableClinicTable />,
  play: async ({ canvas }) => {
    const parentRow = canvas.getByRole("row", { name: /Clínica Aurora/ });
    const expandButton = canvas.getByRole("button", {
      name: /Mostrar ou ocultar Clínica Aurora/,
    });
    await expect(expandButton.querySelector("svg")).toHaveStyle({
      transform: "matrix(0, 1, -1, 0, 0, 0)",
    });

    const childRow = canvas.getByRole("row", { name: /Unidade Centro/ });
    await expect(childRow).toBeVisible();
    await expect(childRow).toHaveAttribute("data-level", "2");
    const childExpandButton = canvas.getByRole("button", {
      name: /Mostrar ou ocultar Unidade Centro/,
    });
    await expect(childExpandButton.querySelector("svg")).toHaveStyle({
      transform: "matrix(0, 1, -1, 0, 0, 0)",
    });
    await expect(parentRow).toHaveAttribute("data-expanded", "true");
    await expect(canvas.getByRole("row", { name: /Recepção/ })).toBeVisible();
    await userEvent.click(childExpandButton);
    await expect(canvas.queryByRole("row", { name: /Recepção/ })).not.toBeInTheDocument();
    await userEvent.click(childExpandButton);
    await expect(canvas.getByRole("row", { name: /Recepção/ })).toBeVisible();
    const leafRow = canvas.getByRole("row", { name: /Recepção/ });
    await expect(leafRow).toHaveAttribute("data-level", "3");
    await expect(canvas.getByRole("row", { name: /Consultórios/ })).toBeVisible();
    await userEvent.click(expandButton);
    await expect(canvas.queryByRole("row", { name: /Unidade Centro/ })).not.toBeInTheDocument();
  },
};

export const EstadosDeDados: Story = {
  name: "Estados de dados",
  parameters: {
    docs: {
      description: {
        story:
          "Loading, erro e indisponibilidade têm rótulo e descrição próprios. O estado de erro oferece recuperação explícita; quando existem linhas anteriores, elas permanecem visíveis durante a atualização.",
      },
    },
  },
  render: () => (
    <div className="clv-story-table-stack">
      <Table>
        <Table.ScrollContainer scrollLabel="Área de rolagem das clínicas carregando">
          <Table.Content label="Clínicas carregando" aria-busy="true">
            <Table.Header>
              <Table.Column id="clinic" isRowHeader>
                Clínica
              </Table.Column>
              <Table.Column id="status">Status</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="aurora">
                <Table.Cell>Clínica Aurora</Table.Cell>
                <Table.Cell>Atualizando dados</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
        <Table.Status state="loading" title="Atualizando dados" />
      </Table>
      <Table variant="plain">
        <Table.ScrollContainer scrollLabel="Área de rolagem das clínicas indisponíveis">
          <Table.Content label="Clínicas indisponíveis">
            <Table.Header>
              <Table.Column id="clinic" isRowHeader>
                Clínica
              </Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <Table.EmptyState
                  description="Tente novamente mais tarde."
                  state="unavailable"
                  title="Resultados indisponíveis"
                />
              )}
            >
              {[]}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  ),
};
