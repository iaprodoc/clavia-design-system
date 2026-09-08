import { KeyValue } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: KeyValue,
  parameters: {
    docs: {
      description: {
        component:
          "Apresenta atributos curtos de um registro em uma lista de descrição. Use vertical para leitura sequencial e horizontal para comparar grupos; valores extensos permanecem legíveis e podem quebrar linha. Não use como tabela de registros ou como substituto de um formulário editável.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Dados/KeyValue",
} satisfies Meta<typeof KeyValue>;
export default meta;
type Story = StoryObj<typeof meta>;
const items = [
  { label: "Responsável", value: "Marina Almeida" },
  { label: "Última atualização", value: "Hoje, 10:32" },
];
export const Vertical: Story = { args: { items } };
export const Horizontal: Story = { args: { items, orientation: "horizontal" } };
export const ConteudoExtenso: Story = {
  args: {
    items: [
      {
        label: "Próxima ação combinada com a clínica",
        value:
          "Confirmar a revisão dos documentos antes da reunião de acompanhamento de sexta-feira.",
      },
      { label: "Responsável", value: "Marina Almeida" },
    ],
    orientation: "horizontal",
  },
};
