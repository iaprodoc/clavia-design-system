import { ArrowRightIcon } from "@clavia-ds/icons";
import { IconButton } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

const meta = {
  args: {
    children: <ArrowRightIcon />,
    label: "Avançar",
  },
  component: IconButton,
  parameters: {
    docs: {
      description: {
        component:
          "Botão compacto para uma ação reconhecível por ícone. Forneça sempre um nome acessível específico e não use a marca da Clavia como ícone funcional.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Ações/IconButton",
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Avançar" })).toHaveAttribute("type", "button");
  },
};

export const Desabilitado: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Avançar" })).toBeDisabled();
  },
};

export const Tamanhos: Story = {
  name: "Tamanhos",
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <IconButton label="Ação pequena" size="sm">
        <ArrowRightIcon />
      </IconButton>
      <IconButton label="Ação média">
        <ArrowRightIcon />
      </IconButton>
      <IconButton label="Ação grande" size="lg">
        <ArrowRightIcon />
      </IconButton>
    </div>
  ),
};

export const Carregando: Story = {
  args: { isLoading: true, label: "Atualizando dados" },
  name: "Carregando",
};
