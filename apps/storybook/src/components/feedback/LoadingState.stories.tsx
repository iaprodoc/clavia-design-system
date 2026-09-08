import { LoadingState } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: LoadingState,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Use enquanto dados necessários ainda estão sendo carregados. Preserve a mensagem de contexto e não o use para esconder falhas ou decisões de produto.",
      },
    },
  },
  title: "Componentes/Feedback/LoadingState",
} satisfies Meta<typeof LoadingState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Padrao: Story = {
  args: { description: "Carregando os dados mais recentes.", label: "Carregando dados" },
};

export const Compacto: Story = {
  args: { description: "Atualizando projetos.", label: "Atualizando dados" },
  render: (args) => (
    <div data-clv-density="compact">
      <LoadingState {...args} />
    </div>
  ),
};
