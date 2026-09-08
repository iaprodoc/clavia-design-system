import { TagInput } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

const meta = {
  args: {
    description: "Cadastre até cinco serviços. Pressione Enter ou vírgula para adicionar.",
    label: "Serviços oferecidos",
    maxTags: 5,
    onChange: () => undefined,
    placeholder: "Ex.: Consulta",
    values: ["Consulta", "Retorno"],
  },
  component: TagInput,
  decorators: [
    (Story) => (
      <div className="clv-story-tag-input-preview">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Entrada controlada para listas curtas de valores livres. Cria com Enter ou vírgula, permite editar e remover por controles nomeados, remove o último item com Backspace quando o campo está vazio e bloqueia duplicatas. Regras de negócio devem ser fornecidas por validateTag; para uma lista conhecida, prefira Combobox.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Componentes/Formulários/TagInput",
} satisfies Meta<typeof TagInput>;

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledExample() {
  const [values, setValues] = useState(["Consulta", "Retorno"]);
  return (
    <TagInput
      description="Cadastre até cinco serviços. Pressione Enter ou vírgula para adicionar."
      label="Serviços oferecidos"
      maxTags={5}
      onChange={setValues}
      placeholder="Ex.: Avaliação"
      values={values}
    />
  );
}

export const CriacaoEdicaoERemocao: Story = {
  name: "Criação, edição e remoção",
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Serviços oferecidos" });

    await userEvent.type(input, "Avaliação{Enter}");
    await expect(canvas.getByText("Avaliação")).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Editar Consulta" }));
    await userEvent.clear(input);
    await userEvent.type(input, "Consulta inicial{Enter}");
    await expect(canvas.getByText("Consulta inicial")).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Remover Retorno" }));
    await expect(canvas.queryByText("Retorno")).not.toBeInTheDocument();
  },
};

export const LimiteAtingido: Story = {
  args: {
    description: "Remova ou edite um item para fazer outra alteração.",
    maxTags: 2,
  },
  name: "Limite atingido",
};

export const ErroDeValidacao: Story = {
  args: {
    error: "Revise os serviços antes de continuar.",
  },
  name: "Erro de validação",
};
