import { Avatar } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component:
          "Identidade visual compacta para pessoas ou entidades. Use imagem quando disponível; o fallback mantém iniciais e um nome acessível.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Dados/Avatar",
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Fallback: Story = { args: { name: "Marina Almeida" } };
export const Tamanhos: Story = {
  args: { name: "Marina Almeida" },
  render: () => (
    <div className="clv-story-stack">
      <Avatar name="Marina Almeida" size="sm" />
      <Avatar name="Marina Almeida" size="md" />
      <Avatar name="Marina Almeida" size="lg" />
    </div>
  ),
};
