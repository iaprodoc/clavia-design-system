import { ArchiveIcon, ExternalLinkIcon } from "@clavia-ds/icons";
import { Button, DataTable, StatusBadge } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

const rows = [
  { id: "aurora", name: "Clínica Aurora", status: "Ativa" },
  { id: "vida", name: "Clínica Vida", status: "Pausada" },
];
const columns = [
  {
    allowsSorting: true,
    id: "name",
    isRowHeader: true,
    label: "Clínica",
    render: (row: (typeof rows)[number]) => row.name,
  },
  {
    id: "status",
    label: "Status",
    render: (row: (typeof rows)[number]) => (
      <StatusBadge status={row.status === "Ativa" ? "success" : "warning"}>
        {row.status}
      </StatusBadge>
    ),
  },
] as const;

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Tabela operacional com ordenação, seleção, checks de seleção múltipla, ações, estados de dados e paginação controladas. Use para listas com campos comparáveis por linha — incluindo pessoas, vínculos, status e ações contextuais. Prefira card local apenas quando o conteúdo não for tabular ou uma leitura mobile distinta for comprovadamente necessária. Busca, filtros, persistência, redimensionamento, carregamento incremental, virtualização e hierarquia permanecem no produto até haver contrato e volume comprovados.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Dados/DataTable",
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Operacional: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set());

    return (
      <div className="clv-story-table-stack">
        <DataTable
          actionMenu={(row) => [
            {
              icon: <ExternalLinkIcon />,
              id: "open-new-tab",
              label: `Abrir ${row.name} em nova aba`,
              onAction: () => undefined,
            },
            { icon: <ArchiveIcon />, id: "archive", label: "Arquivar", onAction: () => undefined },
          ]}
          actionMenuLabel={(row) => `Mais ações para ${row.name}`}
          actions={(row) => (
            <Button size="sm" variant="tertiary">
              Abrir {row.name}
            </Button>
          )}
          columns={columns}
          getRowId={(row) => row.id}
          label="Clínicas"
          pagination={{ currentPage: page, onPageChange: setPage, pageCount: 2 }}
          rows={rows}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          onSelectionChange={(keys) => {
            setSelectedKeys(keys === "all" ? new Set(rows.map((row) => row.id)) : new Set(keys));
          }}
        />
        <p aria-live="polite" className="clv-story-table-selection-summary">
          {selectedKeys.size === 0
            ? "Nenhuma clínica selecionada"
            : `${selectedKeys.size} selecionada(s)`}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const previousPage = canvas.getByRole("button", { name: "Página anterior" });
    const nextPage = canvas.getByRole("button", { name: "Próxima página" });

    await expect(previousPage).toBeDisabled();
    nextPage.focus();
    await expect(nextPage).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByText("Página 2 de 2")).toBeVisible();
    await expect(nextPage).toBeDisabled();

    previousPage.focus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByText("Página 1 de 2")).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Mais ações para Clínica Aurora" }),
    ).toBeVisible();
  },
};

export const MenuDeAcoes: Story = {
  name: "Menu de ações",
  parameters: {
    docs: {
      description: {
        story:
          "Use o overflow de três pontos quando uma linha tiver várias ações secundárias. Reserve botões visíveis para a ação principal da composição.",
      },
    },
  },
  render: () => (
    <DataTable
      actionMenu={(row) => [
        {
          icon: <ExternalLinkIcon />,
          id: "open",
          label: `Abrir ${row.name}`,
          onAction: () => undefined,
        },
        { icon: <ArchiveIcon />, id: "archive", label: "Arquivar", onAction: () => undefined },
      ]}
      actionMenuLabel={(row) => `Mais ações para ${row.name}`}
      actionsVariant="overflow"
      columns={columns}
      getRowId={(row) => row.id}
      label="Clínicas com menu de ações"
      rows={rows}
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("button", { name: "Mais ações para Clínica Aurora" });
    await userEvent.click(trigger);
    const menu = await within(canvasElement.ownerDocument.body).findByRole("menu", {
      name: "Mais ações para Clínica Aurora",
    });
    await waitFor(() =>
      expect(within(menu).getByRole("menuitem", { name: "Arquivar" })).toBeVisible(),
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Carregando: Story = {
  name: "Carregando",
  parameters: {
    docs: {
      description: {
        story:
          'Use `state="loading"` enquanto os dados são buscados ou atualizados. Linhas existentes continuam disponíveis e a tabela anuncia `aria-busy`.',
      },
    },
  },
  render: () => (
    <DataTable
      columns={columns}
      getRowId={(row) => row.id}
      label="Clínicas"
      rows={rows}
      state="loading"
    />
  ),
};

export const Erro: Story = {
  name: "Erro recuperável",
  parameters: {
    docs: {
      description: {
        story:
          "O erro explica a consequência e apresenta uma ação de recuperação. O callback `onRetry` pertence ao consumidor, que decide como refazer a consulta.",
      },
    },
  },
  render: () => (
    <DataTable
      columns={columns}
      errorDescription="A consulta não foi concluída. Tente novamente."
      errorTitle="Falha ao consultar clínicas"
      getRowId={(row) => row.id}
      label="Clínicas"
      onRetry={() => undefined}
      rows={[]}
      state="error"
    />
  ),
};

export const Indisponivel: Story = {
  name: "Indisponível",
  parameters: {
    docs: {
      description: {
        story:
          "Use indisponibilidade quando a área não puder responder no momento e a recuperação não for imediata. Preserve uma consequência clara e um caminho de retorno quando existir.",
      },
    },
  },
  render: () => (
    <DataTable
      columns={columns}
      getRowId={(row) => row.id}
      label="Clínicas"
      rows={[]}
      state="unavailable"
    />
  ),
};
