import { FilterBar, SearchField } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

function FilterBarExample({ compact = false }: { compact?: boolean }) {
  const [value, setValue] = useState("projetos");
  const [status, setStatus] = useState("ativos");

  return (
    <div className={compact ? "clv-story-filter-bar-compact" : undefined}>
      <FilterBar
        aria-label="Filtros de projetos"
        onClear={() => {
          setStatus("");
          setValue("");
        }}
        summary="2 filtros aplicados"
      >
        <SearchField label="Buscar projetos" onChange={setValue} value={value} />
        <label>
          Status
          <select
            aria-label="Status"
            onChange={(event) => setStatus(event.target.value)}
            value={status}
          >
            <option value="ativos">Ativos</option>
            <option value="pausados">Pausados</option>
          </select>
        </label>
      </FilterBar>
    </div>
  );
}

const meta = {
  component: FilterBar,
  parameters: {
    docs: {
      description: {
        component:
          "Agrupa controles que refinam uma lista. O resumo e a limpeza deixam os filtros ativos explícitos; a barra quebra linhas em larguras menores sem esconder controles. Em regiões de resultados, mantenha a barra com 100% da largura e alinhada à tabela ou lista que ela controla. O FilterBar responde apenas pelo espaçamento interno: a composição deve agrupar barra e resultado em um stack com gap semântico. Não use fit-content na barra regional, não limite a busca a uma largura fixa sem justificativa e não use o componente para guardar consulta, permissões ou persistência da tela.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Dados/FilterBar",
} satisfies Meta<typeof FilterBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ComBusca: Story = {
  args: { children: null },
  render: () => <FilterBarExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Limpar filtros" }));
    await expect(canvas.getByRole("searchbox", { name: "Buscar projetos" })).toHaveValue("");
  },
};

export const ControlesCompactos: Story = {
  args: { children: null },
  render: () => <FilterBarExample compact />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole("form", { name: "Filtros de projetos" });

    await expect(canvas.getByRole("searchbox", { name: "Buscar projetos" })).toBeVisible();
    await expect(canvas.getByRole("combobox", { name: "Status" })).toBeVisible();
    await expect(getComputedStyle(bar).gap).toBe("12px");
    await expect(
      getComputedStyle(canvas.getByRole("button", { name: "Limpar filtros" })).minBlockSize,
    ).toBe("44px");
  },
};
