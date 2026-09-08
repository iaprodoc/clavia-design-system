import { FileTextIcon } from "@clavia-ds/icons";
import { NavigationCard } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta = {
  component: NavigationCard,
  parameters: {
    docs: {
      description: {
        component:
          "Use para levar a pessoa a uma área do produto. O destino é obrigatório e aparece como link; não use para confirmar ou iniciar uma ação pontual.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Dados/NavigationCard",
} satisfies Meta<typeof NavigationCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Projetos: Story = {
  args: {
    description: "Acompanhe responsáveis, etapas e pendências.",
    href: "/projetos",
    leadingIcon: <FileTextIcon />,
    title: "Projetos",
  },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: /Projetos/ });
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await expect(link).toHaveAttribute("href", "/projetos");
  },
};
