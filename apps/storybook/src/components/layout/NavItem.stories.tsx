import { FileTextIcon, GridIcon, UsersIcon } from "@clavia-ds/icons";
import { NavItem } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";

const meta = {
  component: NavItem,
  decorators: [
    (Story) => (
      <nav aria-label="Navegação principal" className="clv-story-nav-item">
        <Story />
      </nav>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Link de navegação para destinos reais em barras laterais e menus persistentes. Marque apenas a página exibida com `current`; ele preserva altura de controle, rótulo e foco visível dentro de estruturas como Sidebar e AppShell. Use Button para ações e Stepper para avançar em uma sequência.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Layout/NavItem",
} satisfies Meta<typeof NavItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  args: {
    children: "Projetos",
    href: "#projetos",
    icon: <GridIcon />,
  },
};

export const NavegacaoLateral: Story = {
  args: {
    children: "Projetos",
    href: "#projetos",
  },
  render: () => (
    <>
      <NavItem current href="#projetos" icon={<GridIcon />}>
        Projetos
      </NavItem>
      <NavItem href="#clientes" icon={<UsersIcon />}>
        Clientes
      </NavItem>
      <NavItem href="#documentos" icon={<FileTextIcon />}>
        Documentos
      </NavItem>
    </>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "Projetos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(canvas.getByRole("link", { name: "Clientes" })).not.toHaveAttribute(
      "aria-current",
    );

    await userEvent.tab();
    const currentItem = canvas.getByRole("link", { name: "Projetos" });
    const currentStyle = getComputedStyle(currentItem);
    await expect(currentItem).toHaveFocus();
    await expect(currentStyle.minHeight).toBe("44px");
    await expect(currentStyle.borderInlineStartWidth).toBe("0px");
    await expect(currentStyle.borderRadius).toBe("12px");
    await expect(currentStyle.boxShadow).toBe("none");
    await expect(currentStyle.paddingInlineStart).toBe(currentStyle.paddingInlineEnd);
  },
};
