import { Divider } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const meta = {
  component: Divider,
  parameters: {
    docs: {
      description: {
        component:
          "Separe blocos relacionados quando o espaço por si só não deixa a relação clara. Não use como decoração repetida nem como substituto de uma hierarquia de títulos.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Layout/Divider",
} satisfies Meta<typeof Divider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="clv-story-stack">
      <span>Resumo da clínica</span>
      <Divider />
      <span>Responsáveis</span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("separator")).toBeVisible();
  },
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
};
