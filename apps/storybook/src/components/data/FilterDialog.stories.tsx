import { FilterDialog, FilterDialogGroup, FilterDialogRow, Select } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

const statusOptions = [
  { label: "Todos os status", value: "all" },
  { label: "Requer atenção", value: "attention" },
  { label: "Em revisão", value: "review" },
] as const;

const originOptions = [
  { label: "Todas as origens", value: "all" },
  { label: "Indicação", value: "referral" },
  { label: "Campanha", value: "campaign" },
] as const;

function FilterDialogExample() {
  const [status, setStatus] = useState("all");
  const [origin, setOrigin] = useState("all");
  const [draftStatus, setDraftStatus] = useState(status);
  const [draftOrigin, setDraftOrigin] = useState(origin);
  const activeFilterCount = Number(status !== "all") + Number(origin !== "all");

  return (
    <FilterDialog
      activeFilterCount={activeFilterCount}
      onApply={() => {
        setStatus(draftStatus);
        setOrigin(draftOrigin);
      }}
      onClear={() => {
        setDraftStatus("all");
        setDraftOrigin("all");
      }}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          setDraftStatus(status);
          setDraftOrigin(origin);
        }
      }}
      title="Filtrar projetos"
    >
      <FilterDialogGroup label="Situação">
        <FilterDialogRow label="Status">
          <Select
            label="Status"
            onValueChange={(value) => setDraftStatus(value ?? "all")}
            options={statusOptions}
            value={draftStatus}
          />
        </FilterDialogRow>
      </FilterDialogGroup>
      <FilterDialogGroup label="Origem">
        <FilterDialogRow label="Canal de entrada">
          <Select
            label="Canal de entrada"
            onValueChange={(value) => setDraftOrigin(value ?? "all")}
            options={originOptions}
            value={draftOrigin}
          />
        </FilterDialogRow>
      </FilterDialogGroup>
    </FilterDialog>
  );
}

const meta = {
  component: FilterDialog,
  parameters: {
    docs: {
      description: {
        component:
          "Painel modal para critérios detalhados que precisam de revisão antes da aplicação. Use-o junto de `FilterBar`: `ToggleGroup` mantém recortes rápidos e previsíveis; `FilterDialog` concentra filtros ocasionais, combinações e categorias. Organize critérios relacionados em `FilterDialogGroup`, use `FilterDialogRow` para alinhar rótulo e controle no desktop e preserve o rótulo acessível do campo interno. Não use para busca simples, troca de visualização ou um único filtro que já caiba na barra.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Dados/FilterDialog",
} satisfies Meta<typeof FilterDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CriteriosAvancados: Story = {
  args: { children: null },
  render: () => <FilterDialogExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Filtros" }));

    const dialog = within(document.body).getByRole("dialog", { name: "Filtrar projetos" });
    await expect(dialog).toBeVisible();
    await expect(within(dialog).getByText("Situação")).toBeVisible();
    await expect(within(dialog).getByRole("button", { name: "Aplicar filtros" })).toBeVisible();
  },
};
