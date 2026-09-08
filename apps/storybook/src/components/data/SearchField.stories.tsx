import { SearchField } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

function SearchFieldExample({ initialValue = "" }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue);
  return <SearchField label="Buscar projetos" onChange={setValue} value={value} />;
}

const meta = {
  component: SearchField,
  parameters: {
    docs: {
      description: {
        component:
          "Campo de texto para consultas locais ou enviadas ao produto. O botão de limpeza aparece somente quando há texto e mantém um nome acessível. Não use como filtro persistente sem uma FilterBar, nem para representar a busca rápida por comandos.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Dados/SearchField",
} satisfies Meta<typeof SearchField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Padrao: Story = {
  args: { onChange: () => {}, value: "" },
  render: () => <SearchFieldExample />,
};

export const ComLimpeza: Story = {
  args: { onChange: () => {}, value: "Clínica São Rafael" },
  render: () => <SearchFieldExample initialValue="Clínica São Rafael" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox", { name: "Buscar projetos" });

    await userEvent.click(canvas.getByRole("button", { name: "Limpar busca" }));
    await expect(input).toHaveValue("");
    await expect(canvas.queryByRole("button", { name: "Limpar busca" })).toBeNull();
  },
};
