import { PlusIcon } from "@clavia-ds/icons";
import { CloseButton } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect } from "storybook/test";

const meta = {
  args: {
    label: "Fechar",
  },
  component: CloseButton,
  parameters: {
    docs: {
      description: {
        component:
          "Ação icon-only para fechar ou dispensar uma superfície. O rótulo acessível é obrigatório no comportamento, mas já vem como Fechar quando o contexto não precisa de uma descrição mais específica. Use `xs` (24 px) apenas para fechamento em alertas densos; `sm` (32 px) é o padrão para dialogs, sheets e superfícies com mais espaço.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Ações/CloseButton",
} satisfies Meta<typeof CloseButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Fechar" })).toBeVisible();
  },
};

export const ComIconePersonalizado: Story = {
  name: "Com ícone personalizado",
  render: () => (
    <CloseButton label="Adicionar" size="md">
      <PlusIcon />
    </CloseButton>
  ),
};

function InteractiveCloseButton() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return <p>Superfície fechada.</p>;
  }

  return (
    <div style={{ alignItems: "center", display: "flex", gap: "0.75rem" }}>
      <span>Superfície aberta</span>
      <CloseButton label="Fechar superfície" onClick={() => setIsOpen(false)} />
    </div>
  );
}

export const Interativo: Story = {
  name: "Interativo",
  render: () => <InteractiveCloseButton />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Superfície aberta")).toBeVisible();
    await canvas.getByRole("button", { name: "Fechar superfície" }).click();
    await expect(canvas.getByText("Superfície fechada.")).toBeVisible();
  },
};

export const Tamanhos: Story = {
  name: "Tamanhos",
  render: () => (
    <div style={{ alignItems: "center", display: "flex", gap: "0.75rem" }}>
      <CloseButton label="Fechar extra compacto" size="xs" />
      <CloseButton label="Fechar pequeno" size="sm" />
      <CloseButton label="Fechar médio" size="md" />
      <CloseButton label="Fechar grande" size="lg" />
    </div>
  ),
  play: async ({ canvas }) => {
    const extraSmall = canvas.getByRole("button", { name: "Fechar extra compacto" });
    const small = canvas.getByRole("button", { name: "Fechar pequeno" });
    const medium = canvas.getByRole("button", { name: "Fechar médio" });
    const large = canvas.getByRole("button", { name: "Fechar grande" });

    await expect(extraSmall.getBoundingClientRect().width).toBe(24);
    await expect(small.getBoundingClientRect().width).toBe(32);
    await expect(medium.getBoundingClientRect().width).toBe(36);
    await expect(large.getBoundingClientRect().width).toBe(44);
    await expect(extraSmall.querySelector("svg")).toHaveStyle({ height: "12px", width: "12px" });
    await expect(small.querySelector("svg")).toHaveStyle({ height: "16px", width: "16px" });
  },
};

export const Desabilitado: Story = {
  name: "Desabilitado",
  args: {
    isDisabled: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Fechar" })).toBeDisabled();
  },
};
